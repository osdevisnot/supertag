const DEFAULT = 0
const RECYCLED_NODE = 1
const TEXT_NODE = 2

const XLINK_NS = 'http://www.w3.org/1999/xlink'
const SVG_NS = 'http://www.w3.org/2000/svg'

const EMPTY_OBJECT = {}
const EMPTY_ARRAY = []

const map = EMPTY_ARRAY.map
const isArray = Array.isArray

const eventProxy = event => event.currentTarget.events[event.type](event)

const updateProperty = (element, name, lastValue, nextValue, isSvg) => {
  if (name === 'key') {
  } else if (name === 'style') {
    for (let i in { ...lastValue, ...nextValue }) {
      let style = nextValue == null || nextValue[i] == null ? '' : nextValue[i]
      if (i[0] === '-') {
        element[name].setProperty(i, style)
      } else {
        element[name][i] = style
      }
    }
  } else {
    if (name[0] === 'o' && name[1] === 'n') {
      if (!element.events) element.events = {}
      element.events[(name = name.slice(2))] = nextValue
      if (nextValue == null) {
        element.removeEventListener(name, eventProxy)
      } else if (lastValue == null) {
        element.addEventListener(name, eventProxy)
      }
    } else {
      const nullOrFalse = nextValue == null || nextValue === false

      if (
        name in element &&
        name !== 'list' &&
        name !== 'draggable' &&
        name !== 'spellcheck' &&
        name !== 'translate' &&
        !isSvg
      ) {
        element[name] = nextValue == null ? '' : nextValue
        if (nullOrFalse) {
          element.removeAttribute(name)
        }
      } else {
        const ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''))
        if (ns) {
          if (nullOrFalse) {
            element.removeAttributeNS(XLINK_NS, name)
          } else {
            element.setAttributeNS(XLINK_NS, name, nextValue)
          }
        } else {
          if (nullOrFalse) {
            element.removeAttribute(name)
          } else {
            element.setAttribute(name, nextValue)
          }
        }
      }
    }
  }
}

const createElement = (node, isSvg) => {
  const element =
    node.type === TEXT_NODE
      ? document.createTextNode(node.name)
      : (isSvg = isSvg || node.name === 'svg')
      ? document.createElementNS(SVG_NS, node.name)
      : document.createElement(node.name)

  for (let i = 0, length = node.children.length; i < length; i++) {
    element.appendChild(createElement(node.children[i], isSvg))
  }
  for (let name in node.props) {
    updateProperty(element, name, null, node.props[name], isSvg)
  }

  return (node.element = element)
}

const updateElement = (element, lastProps, nextProps, isSvg, isRecycled) => {
  for (let name in { ...lastProps, ...nextProps }) {
    if ((name === 'value' || name === 'checked' ? element[name] : lastProps[name]) !== nextProps[name]) {
      updateProperty(element, name, lastProps[name], nextProps[name], isSvg)
    }
  }
}

const removeChildren = node => {
  for (let i = 0, length = node.children.length; i < length; i++) {
    removeChildren(node.children[i])
  }
  return node.element
}

const removeElement = (parent, node) => {
  parent.removeChild(removeChildren(node))
}

const getKey = node => {
  return node == null ? null : node.key
}

const createKeyMap = (children, start, end) => {
  let out = {},
    key,
    node

  for (; start <= end; start++) {
    if ((key = (node = children[start]).key) != null) {
      out[key] = node
    }
  }

  return out
}

const patchElement = (parent, element, lastNode, nextNode, isSvg?) => {
  if (nextNode === lastNode) {
  } else if (lastNode != null && lastNode.type === TEXT_NODE && nextNode.type === TEXT_NODE) {
    if (lastNode.name !== nextNode.name) {
      element.nodeValue = nextNode.name
    }
  } else if (lastNode == null || lastNode.name !== nextNode.name) {
    const newElement = parent.insertBefore(createElement(nextNode, isSvg), element)

    if (lastNode != null) removeElement(parent, lastNode)

    element = newElement
  } else {
    updateElement(
      element,
      lastNode.props,
      nextNode.props,
      (isSvg = isSvg || nextNode.name === 'svg'),
      lastNode.type === RECYCLED_NODE
    )

    let savedNode,
      childNode,
      lastKey,
      nextKey,
      lastChildren = lastNode.children,
      nextChildren = nextNode.children,
      lastChStart = 0,
      nextChStart = 0,
      lastChEnd = lastChildren.length - 1,
      nextChEnd = nextChildren.length - 1

    while (nextChStart <= nextChEnd && lastChStart <= lastChEnd) {
      lastKey = getKey(lastChildren[lastChStart])
      nextKey = getKey(nextChildren[nextChStart])

      if (lastKey == null || lastKey !== nextKey) break

      patchElement(
        element,
        lastChildren[lastChStart].element,
        lastChildren[lastChStart],
        nextChildren[nextChStart],
        isSvg
      )

      lastChStart++
      nextChStart++
    }

    while (nextChStart <= nextChEnd && lastChStart <= lastChEnd) {
      lastKey = getKey(lastChildren[lastChEnd])
      nextKey = getKey(nextChildren[nextChEnd])

      if (lastKey == null || lastKey !== nextKey) break

      patchElement(element, lastChildren[lastChEnd].element, lastChildren[lastChEnd], nextChildren[nextChEnd], isSvg)

      lastChEnd--
      nextChEnd--
    }

    if (lastChStart > lastChEnd) {
      while (nextChStart <= nextChEnd) {
        element.insertBefore(
          createElement(nextChildren[nextChStart++], isSvg),
          (childNode = lastChildren[lastChStart]) && childNode.element
        )
      }
    } else if (nextChStart > nextChEnd) {
      while (lastChStart <= lastChEnd) {
        removeElement(element, lastChildren[lastChStart++])
      }
    } else {
      let lastKeyed = createKeyMap(lastChildren, lastChStart, lastChEnd),
        nextKeyed = {}

      while (nextChStart <= nextChEnd) {
        lastKey = getKey((childNode = lastChildren[lastChStart]))
        nextKey = getKey(nextChildren[nextChStart])

        if (nextKeyed[lastKey] || (nextKey != null && nextKey === getKey(lastChildren[lastChStart + 1]))) {
          if (lastKey == null) {
            removeElement(element, childNode)
          }
          lastChStart++
          continue
        }

        if (nextKey == null || lastNode.type === RECYCLED_NODE) {
          if (lastKey == null) {
            patchElement(element, childNode && childNode.element, childNode, nextChildren[nextChStart], isSvg)
            nextChStart++
          }
          lastChStart++
        } else {
          if (lastKey === nextKey) {
            patchElement(element, childNode.element, childNode, nextChildren[nextChStart], isSvg)
            nextKeyed[nextKey] = true
            lastChStart++
          } else {
            if ((savedNode = lastKeyed[nextKey]) != null) {
              patchElement(
                element,
                element.insertBefore(savedNode.element, childNode && childNode.element),
                savedNode,
                nextChildren[nextChStart],
                isSvg
              )
              nextKeyed[nextKey] = true
            } else {
              patchElement(element, childNode && childNode.element, null, nextChildren[nextChStart], isSvg)
            }
          }
          nextChStart++
        }
      }

      while (lastChStart <= lastChEnd) {
        if (getKey((childNode = lastChildren[lastChStart++])) == null) {
          removeElement(element, childNode)
        }
      }

      for (let key in lastKeyed) {
        if (nextKeyed[key] == null) {
          removeElement(element, lastKeyed[key])
        }
      }
    }
  }

  return (nextNode.element = element)
}

const createVNode = (name, props, children, element, key, type) => ({
  name: name,
  props: props,
  children: children,
  element: element,
  key: key,
  type: type
})

const createTextVNode = (text, element?) => createVNode(text, EMPTY_OBJECT, EMPTY_ARRAY, element, null, TEXT_NODE)

const recycleChild = element =>
  element.nodeType === 3 ? createTextVNode(element.nodeValue, element) : recycleElement(element)

const recycleElement = element =>
  createVNode(
    element.nodeName.toLowerCase(),
    EMPTY_OBJECT,
    map.call(element.childNodes, recycleChild),
    element,
    null,
    RECYCLED_NODE
  )

const recycle = container => recycleElement(container.children[0])

const patch = (lastNode, nextNode, container) => {
  patchElement(container, container.children[0], lastNode, nextNode)
  return nextNode
}

const h = (name, props, ...rest) => {
  let node,
    children: any = []

  if ((props = props == null ? {} : props).children != null) {
    if (rest.length <= 0) {
      rest.push(props.children)
    }
    delete props.children
  }

  while (rest.length > 0) {
    if (isArray((node = rest.pop()))) {
      for (let length = node.length; length-- > 0; ) {
        rest.push(node[length])
      }
    } else if (node === false || node === true || node == null) {
    } else {
      children.push(typeof node === 'object' ? node : createTextVNode(node))
    }
  }

  return typeof name === 'function'
    ? name(props, (props.children = children))
    : createVNode(name, props, children, null, props.key, DEFAULT)
}

export { h, patch, recycle }
