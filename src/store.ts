let _state = {},
  _actions = {},
  _events: any[] = []

const setState = (update, action) => {
  _state = { ..._state, ...update }
  _events.map(handler => handler(_state, action))
}

const store = {
  off(handler) {
    _events.splice(_events.indexOf(handler) >>> 0, 1)
  },
  on(handler) {
    _events.push(handler)
    return store.off.bind(store, handler)
  },
  get state() {
    return _state
  },
  dispatch(action, ...payload) {
    if (_actions[action]) {
      const update = _actions[action](_state, ...payload)
      if (update) {
        if (update.then) {
          return update.then(res => setState(res, action))
        }
        return setState(update, action)
      }
    }
  },
  use(state, actions) {
    _state = { ..._state, ...state }
    _actions = { ..._actions, ...actions }
  }
}
export { store }
