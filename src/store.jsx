import { createContext, useContext, useEffect, useReducer } from 'react'
import { THERAPISTS, createBundle, createHouse, uid, APP_TODAY, hoursBetween } from './data'

const Ctx = createContext(null)
const SESSION_KEY = 'zura.session'

function bundleKey(id) {
  return `zura.bundle.v1.${id}`
}

function readStorage(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore quota and private-mode failures */
  }
}

function loadBundle(id) {
  const raw = readStorage(bundleKey(id))
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.tasks) && Array.isArray(parsed.messages)) {
        const seed = createBundle(id)
        if (!Array.isArray(parsed.attendance)) parsed.attendance = seed.attendance
        if (!Array.isArray(parsed.seenAnnouncements)) parsed.seenAnnouncements = seed.seenAnnouncements
        if (!Array.isArray(parsed.seenTalk)) parsed.seenTalk = seed.seenTalk
        return parsed
      }
    } catch {
      /* fall through to a fresh bundle */
    }
  }
  return createBundle(id)
}

function loadHouse() {
  const raw = readStorage('zura.house.v1')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.team) && Array.isArray(parsed.p2p)) {
        const seed = createHouse()
        if (!Array.isArray(parsed.announcements)) parsed.announcements = seed.announcements
        if (!Array.isArray(parsed.talk)) parsed.talk = seed.talk
        return parsed
      }
    } catch {
      /* fall through */
    }
  }
  return createHouse()
}

function init() {
  const house = loadHouse()
  const id = readStorage(SESSION_KEY)
  if (id && THERAPISTS[id]) {
    return {
      therapistId: id,
      route: 'today',
      flash: null,
      bundle: loadBundle(id),
      house,
      selectedTaskId: null,
      selectedMessageId: null,
    }
  }
  return {
    therapistId: null,
    route: 'today',
    flash: null,
    bundle: null,
    house,
    selectedTaskId: null,
    selectedMessageId: null,
  }
}

function withBundle(state, recipe, flash = null) {
  return { ...state, bundle: recipe(state.bundle), flash }
}

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        therapistId: action.id,
        route: 'today',
        flash: null,
        bundle: loadBundle(action.id),
        selectedTaskId: null,
        selectedMessageId: null,
      }
    case 'logout':
      return {
        ...state,
        therapistId: null,
        route: 'today',
        flash: null,
        bundle: null,
        selectedTaskId: null,
        selectedMessageId: null,
      }
    case 'go':
      return {
        ...state,
        route: action.route,
        flash: null,
        selectedTaskId: action.selectedTaskId !== undefined ? action.selectedTaskId : state.selectedTaskId,
        selectedMessageId: action.selectedMessageId !== undefined ? action.selectedMessageId : state.selectedMessageId,
      }
    case 'clearFlash':
      return { ...state, flash: null }
    case 'openMessage':
      return {
        ...withBundle(state, (bundle) => ({
          ...bundle,
          messages: bundle.messages.map((message) =>
            message.id === action.id ? { ...message, unread: false } : message,
          ),
        })),
        selectedMessageId: action.id,
      }
    case 'selectTask':
      return { ...state, selectedTaskId: action.id }
    case 'setTaskStatus':
      return withBundle(
        state,
        (bundle) => ({
          ...bundle,
          tasks: bundle.tasks.map((task) =>
            task.id === action.id ? { ...task, status: action.status } : task,
          ),
        }),
        action.status === 'done' ? 'Task marked done.' : 'Task started.',
      )
    case 'toggleCheck':
      return withBundle(state, (bundle) => ({
        ...bundle,
        tasks: bundle.tasks.map((task) =>
          task.id === action.taskId
            ? {
                ...task,
                checklist: task.checklist.map((item, index) =>
                  index === action.index ? { ...item, done: !item.done } : item,
                ),
              }
            : task,
        ),
      }))
    case 'addTaskNote':
      return withBundle(
        state,
        (bundle) => ({
          ...bundle,
          tasks: bundle.tasks.map((task) =>
            task.id === action.taskId
              ? { ...task, notes: [...task.notes, { id: uid(), text: action.text, at: APP_TODAY }] }
              : task,
          ),
        }),
        'Note added to the task.',
      )
    case 'addApplication':
      return withBundle(
        state,
        (bundle) => ({
          ...bundle,
          applications: [
            {
              id: uid(),
              kind: action.kind,
              title: action.title,
              detail: action.detail,
              submitted: APP_TODAY,
              status: 'pending',
              decision: 'Waiting on a lead.',
            },
            ...bundle.applications,
          ],
        }),
        action.kind === 'leave'
          ? 'Leave request sent. It shows as pending until a lead answers.'
          : 'Funding request sent. It shows as pending until a lead answers.',
      )
    case 'addBioEdit': {
      const pending = state.bundle.bioEdits.some(
        (edit) => edit.field === action.field && edit.status === 'pending',
      )
      if (pending) {
        return { ...state, flash: 'You already have a pending edit for that field.' }
      }
      return withBundle(
        state,
        (bundle) => ({
          ...bundle,
          bioEdits: [
            {
              id: uid(),
              field: action.field,
              label: action.label,
              value: action.value,
              reason: action.reason,
              submitted: APP_TODAY,
              status: 'pending',
              decision: 'With the people desk. Your profile stays as it is until they approve it.',
            },
            ...bundle.bioEdits,
          ],
        }),
        'Edit requested. Your profile stays unchanged until it is approved.',
      )
    }
    case 'addQuery':
      return withBundle(
        state,
        (bundle) => ({
          ...bundle,
          queries: [
            {
              id: uid(),
              subject: action.subject,
              body: action.body,
              opened: APP_TODAY,
              status: 'open',
              resolution: '',
            },
            ...bundle.queries,
          ],
        }),
        'Query sent. It stays open until someone writes a resolution.',
      )
    case 'addEscalation':
      return withBundle(
        state,
        (bundle) => ({
          ...bundle,
          escalations: [
            {
              id: uid(),
              area: action.area,
              urgency: action.urgency,
              description: action.description,
              need: action.need,
              opened: APP_TODAY,
              status: 'received',
              update: 'A lead has this. The status will change here.',
            },
            ...bundle.escalations,
          ],
        }),
        'Escalation received. A lead has it.',
      )
    case 'addSessionNote':
      return withBundle(
        state,
        (bundle) => ({
          ...bundle,
          sessionNotes: [
            {
              id: uid(),
              date: action.date,
              mood: action.mood,
              text: action.text,
            },
            ...bundle.sessionNotes,
          ],
        }),
        'Note saved on your session record.',
      )
    case 'submitAssignment':
      return withBundle(
        state,
        (bundle) => ({
          ...bundle,
          assignments: bundle.assignments.map((assignment) =>
            assignment.id === action.id
              ? {
                  ...assignment,
                  status: 'submitted',
                  submission: action.text,
                  submittedOn: APP_TODAY,
                }
              : assignment,
          ),
        }),
        'Assignment sent to your Stillwater therapist.',
      )
    case 'submitTeamReview': {
      const already = state.house.team.some(
        (review) => review.date === APP_TODAY && review.from === action.from,
      )
      if (already) return { ...state, flash: 'You already closed today’s team review.' }
      return {
        ...state,
        flash: 'Team review is on the board.',
        house: {
          ...state.house,
          team: [
            {
              id: uid(),
              date: APP_TODAY,
              from: action.from,
              floor: action.floor,
              worked: action.worked,
              fix: action.fix,
              shout: action.shout,
            },
            ...state.house.team,
          ],
        },
      }
    }
    case 'ensureAttendance':
      if (!state.bundle || Array.isArray(state.bundle.attendance)) return state
      return {
        ...state,
        bundle: { ...state.bundle, attendance: createBundle(state.therapistId).attendance },
      }
    case 'clockIn': {
      const attendance = state.bundle.attendance || createBundle(state.therapistId).attendance
      const open = attendance.find((day) => day.date === APP_TODAY && day.clockIn && !day.clockOut)
      if (open) return { ...state, flash: `You are already on the floor, since ${open.clockIn}.` }
      const done = attendance.find((day) => day.date === APP_TODAY && day.clockOut)
      if (done) return { ...state, flash: 'Today is already closed. The desk can correct a missed time.' }
      return withBundle(
        state,
        () => ({
          ...state.bundle,
          attendance: [
            { id: uid(), date: APP_TODAY, clockIn: action.time, clockOut: '', kind: 'worked', note: '' },
            ...attendance.filter((day) => day.date !== APP_TODAY),
          ],
        }),
        `Clocked in at ${action.time}.`,
      )
    }
    case 'clockOut': {
      const attendance = state.bundle.attendance || []
      const today = attendance.find((day) => day.date === APP_TODAY && day.kind === 'worked')
      if (!today?.clockIn) return { ...state, flash: 'Clock in before you clock out.' }
      if (today.clockOut) return { ...state, flash: 'You have already clocked out today.' }
      const hours = hoursBetween(today.clockIn, action.time)
      return withBundle(
        state,
        (bundle) => ({
          ...bundle,
          attendance: attendance.map((day) =>
            day.date === APP_TODAY ? { ...day, clockOut: action.time } : day,
          ),
        }),
        hours ? `Clocked out at ${action.time}. ${hours} on the floor.` : `Clocked out at ${action.time}.`,
      )
    }
    case 'ensureFloor': {
      let house = state.house
      let bundle = state.bundle
      if (house && (!Array.isArray(house.announcements) || !Array.isArray(house.talk))) {
        const seed = createHouse()
        house = {
          ...house,
          announcements: Array.isArray(house.announcements) ? house.announcements : seed.announcements,
          talk: Array.isArray(house.talk) ? house.talk : seed.talk,
        }
      }
      if (bundle && state.therapistId && (!Array.isArray(bundle.seenAnnouncements) || !Array.isArray(bundle.seenTalk))) {
        const seed = createBundle(state.therapistId)
        bundle = {
          ...bundle,
          seenAnnouncements: Array.isArray(bundle.seenAnnouncements) ? bundle.seenAnnouncements : seed.seenAnnouncements,
          seenTalk: Array.isArray(bundle.seenTalk) ? bundle.seenTalk : seed.seenTalk,
        }
      }
      if (house === state.house && bundle === state.bundle) return state
      return { ...state, house, bundle }
    }
    case 'seeAnnouncement': {
      const seen = state.bundle.seenAnnouncements || []
      if (seen.includes(action.id)) return state
      return {
        ...state,
        bundle: { ...state.bundle, seenAnnouncements: [...seen, action.id] },
      }
    }
    case 'seeTalk': {
      const seen = state.bundle.seenTalk || []
      const extra = action.ids.filter((id) => !seen.includes(id))
      if (!extra.length) return state
      return {
        ...state,
        bundle: { ...state.bundle, seenTalk: [...seen, ...extra] },
      }
    }
    case 'postPublic': {
      const text = action.text.trim()
      if (!text) return { ...state, flash: 'Write a note before you post it.' }
      const item = {
        id: uid(),
        kind: 'public',
        from: action.from,
        to: '',
        date: APP_TODAY,
        time: action.time,
        text,
      }
      return {
        ...state,
        flash: 'Posted on the floor.',
        house: { ...state.house, talk: [...state.house.talk, item] },
        bundle: { ...state.bundle, seenTalk: [...(state.bundle.seenTalk || []), item.id] },
      }
    }
    case 'sendChat': {
      const text = action.text.trim()
      if (!text) return { ...state, flash: 'Write a note before you send it.' }
      const item = {
        id: uid(),
        kind: 'direct',
        from: action.from,
        to: action.to,
        date: APP_TODAY,
        time: action.time,
        text,
      }
      return {
        ...state,
        flash: `Sent to ${action.to}.`,
        house: { ...state.house, talk: [...state.house.talk, item] },
        bundle: { ...state.bundle, seenTalk: [...(state.bundle.seenTalk || []), item.id] },
      }
    }
    case 'submitP2P': {
      const already = state.house.p2p.some(
        (review) => review.date === APP_TODAY && review.from === action.from && review.to === action.to,
      )
      if (already) {
        return { ...state, flash: `You already reviewed ${action.to} today.` }
      }
      return {
        ...state,
        flash: `Peer review sent to ${action.to}.`,
        house: {
          ...state.house,
          p2p: [
            {
              id: uid(),
              date: APP_TODAY,
              from: action.from,
              to: action.to,
              presence: action.presence,
              craft: action.craft,
              teamwork: action.teamwork,
              note: action.note,
            },
            ...state.house.p2p,
          ],
        },
      }
    }
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, init)

  useEffect(() => {
    if (state.therapistId) writeStorage(SESSION_KEY, state.therapistId)
    else {
      try {
        localStorage.removeItem(SESSION_KEY)
      } catch {
        /* ignore */
      }
    }
  }, [state.therapistId])

  useEffect(() => {
    if (state.therapistId && state.bundle) {
      writeStorage(bundleKey(state.therapistId), JSON.stringify(state.bundle))
    }
  }, [state.therapistId, state.bundle])

  useEffect(() => {
    if (state.house) writeStorage('zura.house.v1', JSON.stringify(state.house))
  }, [state.house])

  useEffect(() => {
    if (state.bundle && !Array.isArray(state.bundle.attendance)) dispatch({ type: 'ensureAttendance' })
  }, [state.bundle])

  useEffect(() => {
    const houseMissing = state.house && (!Array.isArray(state.house.announcements) || !Array.isArray(state.house.talk))
    const bundleMissing =
      state.bundle && (!Array.isArray(state.bundle.seenAnnouncements) || !Array.isArray(state.bundle.seenTalk))
    if (houseMissing || bundleMissing) dispatch({ type: 'ensureFloor' })
  }, [state.house, state.bundle])

  const value = {
    ...state,
    therapist: state.therapistId ? THERAPISTS[state.therapistId] : null,
    bundle: state.bundle ? { ...state.bundle, team: state.house.team, p2p: state.house.p2p } : null,
    login(code) {
      const id = code.trim().toUpperCase()
      if (!THERAPISTS[id]) return 'That code is not on the Zura floor list.'
      dispatch({ type: 'login', id })
      return null
    },
    logout() {
      dispatch({ type: 'logout' })
    },
    go(route, extra = {}) {
      dispatch({ type: 'go', route, ...extra })
    },
    clearFlash() {
      dispatch({ type: 'clearFlash' })
    },
    openMessage(id) {
      dispatch({ type: 'openMessage', id })
    },
    openTask(id) {
      dispatch({ type: 'go', route: 'tasks', selectedTaskId: id })
    },
    selectTask(id) {
      dispatch({ type: 'selectTask', id })
    },
    setTaskStatus(id, status) {
      dispatch({ type: 'setTaskStatus', id, status })
    },
    toggleCheck(taskId, index) {
      dispatch({ type: 'toggleCheck', taskId, index })
    },
    addTaskNote(taskId, text) {
      dispatch({ type: 'addTaskNote', taskId, text })
    },
    addApplication(kind, title, detail) {
      dispatch({ type: 'addApplication', kind, title, detail })
    },
    addBioEdit(field, label, value, reason) {
      dispatch({ type: 'addBioEdit', field, label, value, reason })
    },
    addQuery(subject, body) {
      dispatch({ type: 'addQuery', subject, body })
    },
    addEscalation(payload) {
      dispatch({ type: 'addEscalation', ...payload })
    },
    addSessionNote(payload) {
      dispatch({ type: 'addSessionNote', ...payload })
    },
    submitAssignment(id, text) {
      dispatch({ type: 'submitAssignment', id, text })
    },
    submitTeamReview(payload) {
      dispatch({ type: 'submitTeamReview', ...payload })
    },
    submitP2P(payload) {
      dispatch({ type: 'submitP2P', ...payload })
    },
    clockIn(time) {
      dispatch({ type: 'clockIn', time })
    },
    clockOut(time) {
      dispatch({ type: 'clockOut', time })
    },
    seeAnnouncement(id) {
      dispatch({ type: 'seeAnnouncement', id })
    },
    seeTalk(ids) {
      dispatch({ type: 'seeTalk', ids })
    },
    postPublic(from, text, time) {
      dispatch({ type: 'postPublic', from, text, time })
    },
    sendChat(from, to, text, time) {
      dispatch({ type: 'sendChat', from, to, text, time })
    },
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  return useContext(Ctx)
}
