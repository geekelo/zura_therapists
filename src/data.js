export const APP_TODAY = '2026-11-24'
export const CURRENT_MONTH_KEY = '2026-11'
export const CURRENT_MONTH_LABEL = 'November 2026'

export const TEAM_PROMPT = 'What slowed the floor today, and what should tomorrow’s lead protect?'

export const POST_LABELS = [
  { id: 'task', label: 'Task for you', tone: 'ink' },
  { id: 'group', label: 'Group task', tone: 'gold' },
  { id: 'query', label: 'Query', tone: 'wait' },
  { id: 'sanction', label: 'Sanction', tone: 'no' },
  { id: 'reminder', label: 'Reminder', tone: 'gold' },
  { id: 'session', label: 'Assigned session', tone: 'ok' },
]

export function postLabel(id) {
  return POST_LABELS.find((item) => item.id === id) || { id, label: id, tone: 'ink' }
}

export const TASK_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'session', label: 'Session' },
  { id: 'cleaning', label: 'Cleaning' },
  { id: 'operations', label: 'Operations' },
  { id: 'leader', label: 'Leader' },
  { id: 'social', label: 'Social' },
]

export const TYPE_NAME = {
  session: 'Session',
  cleaning: 'Cleaning',
  operations: 'Operations',
  leader: 'Leader',
  social: 'Social',
}

export const BIO_FIELDS = [
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
  { id: 'address', label: 'Home address' },
  { id: 'emergency', label: 'Emergency contact' },
  { id: 'languages', label: 'Languages' },
  { id: 'specialties', label: 'Specialties' },
]

export const FLOOR_WORDS = ['', 'Strained', 'Uneven', 'Steady', 'Smooth', 'Excellent']

export function prettyDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function weekday(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'long' })
}

export function whenLabel(iso) {
  if (iso === APP_TODAY) return 'Today'
  return prettyDate(iso)
}

export function money(amount) {
  return new Intl.NumberFormat('en-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function clockStamp() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export function minutesOf(time) {
  const [hours, mins] = time.split(':').map(Number)
  return hours * 60 + mins
}

export function hoursBetween(start, end) {
  if (!start || !end) return ''
  const span = minutesOf(end) - minutesOf(start)
  if (span < 0) return ''
  const hours = Math.floor(span / 60)
  const mins = span % 60
  return mins ? `${hours}h ${mins}m` : `${hours}h`
}

export function describeDay(record, shift) {
  if (!record) return { status: 'due', hours: '', late: false }
  if (record.kind === 'leave') return { status: 'leave', hours: '', late: false }
  if (record.kind === 'absent') return { status: 'absent', hours: '', late: false }
  const start = shift.split('–')[0]
  const late = minutesOf(record.clockIn) > minutesOf(start) + 10
  if (!record.clockOut) return { status: late ? 'late' : 'in', hours: '', late }
  return { status: late ? 'late' : 'present', hours: hoursBetween(record.clockIn, record.clockOut), late }
}

function worked(date, clockIn, clockOut, note = '') {
  return { id: date, date, clockIn, clockOut, kind: 'worked', note }
}

function marked(date, kind, note) {
  return { id: date, date, clockIn: '', clockOut: '', kind, note }
}

function amaraAttendance() {
  return [
    worked('2026-11-23', '08:51', '17:08'),
    worked('2026-11-22', '09:05', '16:40', 'Short Sunday book.'),
    worked('2026-11-21', '08:56', '17:02'),
    worked('2026-11-20', '09:17', '17:11', 'Tram held outside Westerpark.'),
    worked('2026-11-19', '08:58', '17:04'),
    marked('2026-11-18', 'absent', 'Called the desk at 07:20. The book was covered.'),
    worked('2026-11-17', '09:00', '17:16'),
    worked('2026-11-16', '09:22', '17:30', 'Late in. Stayed to close the gap.'),
    worked('2026-11-14', '08:54', '17:00'),
    worked('2026-11-13', '09:03', '17:09'),
    worked('2026-11-11', '08:57', '17:05'),
    worked('2026-11-10', '09:01', '17:12'),
    worked('2026-11-09', '08:49', '17:01'),
    worked('2026-11-07', '09:04', '17:18'),
    worked('2026-11-06', '08:55', '17:00'),
    worked('2026-11-05', '09:00', '17:06'),
    worked('2026-11-04', '08:52', '17:03'),
    worked('2026-11-03', '09:02', '17:10'),
    worked('2026-11-02', '08:58', '17:04'),
    worked('2026-10-17', '08:56', '17:02'),
    marked('2026-10-16', 'leave', 'Annual leave. Approved 6 September.'),
    marked('2026-10-15', 'leave', 'Annual leave. Approved 6 September.'),
    marked('2026-10-14', 'leave', 'Annual leave. Approved 6 September.'),
    marked('2026-10-13', 'leave', 'Annual leave. Approved 6 September.'),
    marked('2026-10-12', 'leave', 'Annual leave. Approved 6 September.'),
    worked('2026-10-10', '09:06', '17:08'),
    worked('2026-10-09', '08:53', '17:00'),
  ]
}

function noorAttendance() {
  return [
    worked('2026-11-23', '10:52', '19:08'),
    worked('2026-11-22', '11:00', '17:30', 'Short Sunday book.'),
    worked('2026-11-21', '11:28', '19:20', 'Late train from Utrecht.'),
    worked('2026-11-20', '11:06', '19:12'),
    marked('2026-11-18', 'absent', 'Ife took the book. Noor called before ten.'),
    worked('2026-11-17', '10:50', '19:04'),
    worked('2026-11-14', '11:00', '18:50'),
    worked('2026-11-13', '10:57', '19:00'),
    worked('2026-11-11', '11:20', '19:15', 'Came from a dentist. Desk knew.'),
    worked('2026-11-10', '11:02', '19:05'),
    worked('2026-11-07', '10:55', '18:40'),
    worked('2026-11-06', '11:00', '19:00'),
    worked('2026-11-04', '11:04', '19:10'),
    worked('2026-11-03', '10:58', '19:02'),
    worked('2026-10-30', '10:56', '19:00'),
    worked('2026-10-28', '11:03', '19:06'),
    worked('2026-10-24', '11:18', '19:11', 'Rain delayed the tram.'),
    worked('2026-10-21', '10:59', '19:01'),
    worked('2026-10-16', '11:00', '18:48'),
    worked('2026-10-14', '10:54', '19:00'),
    worked('2026-10-10', '11:01', '19:04'),
  ]
}

export function greeting(name) {
  const hour = new Date().getHours()
  const part = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  return `${part}, ${name}`
}

export function closedMonths(months) {
  return months.filter((month) => month.key < CURRENT_MONTH_KEY)
}

export function sumAmounts(months) {
  return months.reduce((total, month) => total + month.amount, 0)
}

function months(rows) {
  return rows.map(([key, label, amount]) => ({
    key,
    label,
    amount,
    year: Number(key.slice(0, 4)),
  }))
}

function check(labels, doneUntil = 0) {
  return labels.map((label, index) => ({ label, done: index < doneUntil }))
}

export const THERAPISTS = {
  'ZURA-4418': {
    id: 'ZURA-4418',
    name: 'Amara Cole',
    first: 'Amara',
    initials: 'AC',
    role: 'Lead therapist',
    branch: 'Keizersgracht',
    shift: '09:00–17:00',
    phone: '+31 6 1840 2291',
    email: 'amara.cole@zuraspa.com',
    address: 'Bilderdijkstraat 18, 1052 NH Amsterdam',
    emergency: 'Jonah Cole · brother · +44 7700 900182',
    languages: 'English, Dutch',
    specialties: 'Deep tissue, hot stone, floor leadership',
    qualifications: 'CIDESCO · hot stone · trauma-informed touch',
    contract: 'Permanent · 32 hours',
    joined: '4 March 2024',
    joinedShort: 'March 2024',
    peers: ['Lena Visser', 'Tobi Adeyemi', 'Ife Salami', 'Noor Vermeer', 'Jonas Bakker'],
  },
  'ZURA-2207': {
    id: 'ZURA-2207',
    name: 'Noor Vermeer',
    first: 'Noor',
    initials: 'NV',
    role: 'Therapist',
    branch: 'Keizersgracht',
    shift: '11:00–19:00',
    phone: '+31 6 4420 1184',
    email: 'noor.vermeer@zuraspa.com',
    address: 'Van Ostadestraat 42, 1072 SX Amsterdam',
    emergency: 'Mila Vermeer · sister · +31 6 2201 4480',
    languages: 'Dutch, English',
    specialties: 'Swedish, scalp rituals, pregnancy-safe massage',
    qualifications: 'CIDESCO · pregnancy massage',
    contract: 'Permanent · 24 hours',
    joined: '12 January 2026',
    joinedShort: 'January 2026',
    peers: ['Amara Cole', 'Lena Visser', 'Tobi Adeyemi', 'Ife Salami', 'Jonas Bakker'],
  },
}

function amaraBundle() {
  return {
    messages: [
      {
        id: 'm1',
        kind: 'task',
        taskId: 't1',
        from: 'Floor desk',
        time: '08:40',
        date: APP_TODAY,
        subject: 'Pressure note for Suite 3',
        body: 'Guest A.O. is back for deep tissue at 10:00. Last visit they asked for lighter work through the neck and jaw. The intake card is already on the suite bench.',
        unread: true,
      },
      {
        id: 'm2',
        kind: 'task',
        taskId: 't2',
        from: 'Housekeeping lead',
        time: '08:55',
        date: APP_TODAY,
        subject: 'Reset card changed',
        body: 'The suite reset now includes the oil decanter, not only the linen. Use the new card on the back of the suite door. Suite 3 is yours after the 10:00.',
        unread: true,
      },
      {
        id: 'm3',
        kind: 'activity',
        activity: 'Stillwater',
        from: 'People team',
        time: 'Yesterday',
        date: '2026-11-23',
        subject: 'Thursday session is held',
        body: 'Your internal session with Dr Helen Voss stays at 18:00 on Thursday 26 November, Quiet Room. If the floor runs late, text the people desk before 17:00 and they will hold the room for fifteen minutes.',
        unread: false,
      },
      {
        id: 'm4',
        kind: 'task',
        taskId: 't5',
        from: 'Social lead',
        time: 'Yesterday',
        date: '2026-11-23',
        subject: 'Story brief, no guest faces',
        body: 'Film the lavender pour only. Stay inside the studio doorway. If a colleague steps in, they need the consent card in shot. No guest corridor, no names.',
        unread: false,
      },
      {
        id: 'm5',
        kind: 'activity',
        activity: 'Team review',
        from: 'Jonas Bakker',
        time: '09:05',
        date: APP_TODAY,
        subject: 'The day board is open',
        body: 'Lena and Tobi have already left a note on today’s team review. Yours still closes the board. Peer reviews can wait until after the 15:00 brief.',
        unread: true,
      },
      {
        id: 'm6',
        kind: 'task',
        taskId: 't3',
        from: 'Operations',
        time: 'Monday',
        date: '2026-11-23',
        subject: 'Apothecary count sheet',
        body: 'Count the lavender, the magnesium, and the retail sizes only. Leave the treatment decanters. The sheet is clipped inside the apothecary cupboard.',
        unread: false,
      },
    ],
    tasks: [
      {
        id: 't1',
        type: 'session',
        title: 'Deep tissue · 90 min',
        time: '10:00–11:30',
        date: APP_TODAY,
        place: 'Suite 3',
        detail: 'Guest A.O., returning. Lighter pressure through the neck and jaw. Initials only on this list.',
        status: 'assigned',
        channel: '',
        checklist: check(['Room at temperature', 'Intake card read', 'Oil warmed', 'Neck pressure noted']),
        notes: [{ id: 'tn1', text: 'Desk already passed the pressure note.', at: APP_TODAY }],
      },
      {
        id: 't2',
        type: 'cleaning',
        title: 'Suite reset',
        time: '12:30–12:50',
        date: APP_TODAY,
        place: 'Suite 3',
        detail: 'Full reset after the deep tissue. New card: linen, oil decanter, floor, and the bin.',
        status: 'assigned',
        channel: '',
        checklist: check(['Linen stripped and bagged', 'Decanter washed', 'Floor and bench', 'Card signed']),
        notes: [],
      },
      {
        id: 't3',
        type: 'operations',
        title: 'Apothecary count',
        time: '13:15–13:45',
        date: APP_TODAY,
        place: 'Apothecary',
        detail: 'Retail count only. Lavender, magnesium, and the three retail sizes. Do not open treatment decanters.',
        status: 'assigned',
        channel: '',
        checklist: check(['Lavender bottles', 'Magnesium', 'Retail sizes', 'Sheet back on the cupboard']),
        notes: [],
      },
      {
        id: 't4',
        type: 'leader',
        title: 'Junior floor brief',
        time: '15:00–15:20',
        date: APP_TODAY,
        place: 'Studio',
        detail: 'Hold the brief even if the book is busy. Cover the late arrival, who resets Suite 2, and who is on the door at close.',
        status: 'assigned',
        channel: '',
        checklist: check(['Late arrival named', 'Suite 2 owner named', 'Close covered', 'Questions taken']),
        notes: [],
      },
      {
        id: 't5',
        type: 'social',
        title: 'Lavender ritual, stories',
        time: '16:30–16:45',
        date: APP_TODAY,
        place: 'Studio doorway',
        detail: 'A short story for the house account. Oil pour only. No guest faces, no guest corridor, no names.',
        status: 'assigned',
        channel: 'Instagram stories',
        checklist: check(['Consent card in frame if a colleague appears', 'Pour filmed', 'Corridor avoided', 'Sent to the social lead']),
        notes: [],
      },
      {
        id: 't6',
        type: 'session',
        title: 'Hot stone · 75 min',
        time: '14:00–15:15',
        date: '2026-11-23',
        place: 'Suite 1',
        detail: 'Guest M.K. Stones stayed off the left shoulder, as asked.',
        status: 'done',
        channel: '',
        checklist: check(['Stones checked', 'Shoulder note followed', 'Room handed back'], 3),
        notes: [{ id: 'tn2', text: 'Left shoulder stayed off the stones. Guest left steady.', at: '2026-11-23' }],
      },
      {
        id: 't7',
        type: 'cleaning',
        title: 'Closing reset',
        time: '17:40–18:10',
        date: '2026-11-23',
        place: 'Suites 1 and 2',
        detail: 'Both suites left ready for the open.',
        status: 'done',
        channel: '',
        checklist: check(['Suite 1', 'Suite 2', 'Linen out'], 3),
        notes: [],
      },
      {
        id: 't8',
        type: 'leader',
        title: 'Opening brief',
        time: '09:00–09:15',
        date: '2026-11-23',
        place: 'Studio',
        detail: 'Named the diffuser fault and who was covering Suite 2.',
        status: 'done',
        channel: '',
        checklist: check(['Board read', 'Covers named'], 2),
        notes: [],
      },
      {
        id: 't9',
        type: 'operations',
        title: 'Linen order check',
        time: '12:00–12:20',
        date: '2026-11-22',
        place: 'Linen room',
        detail: 'Confirmed the Tuesday delivery against the sheet.',
        status: 'done',
        channel: '',
        checklist: check(['Count matched', 'Sheet signed'], 2),
        notes: [],
      },
      {
        id: 't10',
        type: 'social',
        title: 'Still of the oil shelf',
        time: '16:00–16:10',
        date: '2026-11-22',
        place: 'Apothecary',
        detail: 'One still, no people, sent to the social lead.',
        status: 'done',
        channel: 'Instagram feed',
        checklist: check(['Shelf only', 'Sent'], 2),
        notes: [],
      },
    ],
    applications: [
      {
        id: 'ap1',
        kind: 'funding',
        title: 'European wellness congress, Antwerp · €640',
        detail: 'Two days in January. I would bring the notes back to the Thursday brief.',
        submitted: '2026-11-18',
        status: 'pending',
        decision: 'With the people lead. No answer yet.',
      },
      {
        id: 'ap2',
        kind: 'leave',
        title: 'Annual leave · 7 Nov 2026 to 8 Nov 2026',
        detail: 'A long weekend after the leadership Saturday.',
        submitted: '2026-10-20',
        status: 'declined',
        decision: 'Declined by the floor lead. Those dates cover the leadership weekend, and the house cannot spare a lead.',
      },
      {
        id: 'ap3',
        kind: 'leave',
        title: 'Annual leave · 12 Oct 2026 to 16 Oct 2026',
        detail: 'Family visit. Book already moved.',
        submitted: '2026-09-02',
        status: 'approved',
        decision: 'Approved by the floor lead on 6 September 2026.',
      },
      {
        id: 'ap4',
        kind: 'leave',
        title: 'Sick leave · 2 Sep 2026 to 2 Sep 2026',
        detail: 'Migraine. Called the desk at 07:10.',
        submitted: '2026-09-02',
        status: 'approved',
        decision: 'Approved. Recorded as one sick day.',
      },
      {
        id: 'ap5',
        kind: 'funding',
        title: 'Myofascial course · €860',
        detail: 'Three evenings. I used it on the longer deep-tissue bookings the next month.',
        submitted: '2026-07-28',
        status: 'approved',
        decision: 'Approved on 4 August 2026. Receipts matched the grant.',
      },
      {
        id: 'ap6',
        kind: 'funding',
        title: 'Handheld camera · €1,150',
        detail: 'For the social tasks, so we stop borrowing phones.',
        submitted: '2026-06-12',
        status: 'declined',
        decision: 'Declined. Use the house camera. Ask again next quarter if the brief changes.',
      },
    ],
    modules: [
      {
        id: 'mod1',
        title: 'House foundations',
        summary: 'How Zura opens, closes, and speaks to a guest.',
        status: 'complete',
        progress: 100,
        lessons: [
          { title: 'The Keizersgracht floor', done: true },
          { title: 'Opening and closing', done: true },
          { title: 'How we write a note', done: true },
        ],
      },
      {
        id: 'mod2',
        title: 'Consent and trauma-informed touch',
        summary: 'Asking, stopping, and what a note must hold.',
        status: 'complete',
        progress: 100,
        lessons: [
          { title: 'The first question', done: true },
          { title: 'Stopping without fuss', done: true },
          { title: 'Writing what the guest allowed', done: true },
        ],
      },
      {
        id: 'mod3',
        title: 'Hot stone',
        summary: 'Heat, placement, and the people who should not have stones.',
        status: 'complete',
        progress: 100,
        lessons: [
          { title: 'Heat checks', done: true },
          { title: 'Placement map', done: true },
          { title: 'Who we do not stone', done: true },
        ],
      },
      {
        id: 'mod4',
        title: 'Floor leadership',
        summary: 'Briefs, cover, and how to hand the floor on.',
        status: 'current',
        progress: 70,
        lessons: [
          { title: 'A brief people can repeat', done: true },
          { title: 'Naming a cover before you need one', done: true },
          { title: 'The hard conversation', done: false },
        ],
      },
      {
        id: 'mod5',
        title: 'Social craft for the house',
        summary: 'What the house account may show, and what it must never show.',
        status: 'ahead',
        progress: 0,
        lessons: [
          { title: 'The consent card', done: false },
          { title: 'Rooms we may film', done: false },
          { title: 'Sending the cut', done: false },
        ],
      },
    ],
    certificates: [
      { id: 'c1', title: 'House foundations', issued: '2024-04-02', code: 'ZS-HF-1184' },
      { id: 'c2', title: 'Consent and trauma-informed touch', issued: '2024-09-19', code: 'ZS-CT-1302' },
      { id: 'c3', title: 'Hot stone', issued: '2025-05-14', code: 'ZS-HS-2041' },
    ],
    bioEdits: [
      {
        id: 'be1',
        field: 'phone',
        label: 'Phone',
        value: '+31 6 1840 2291',
        reason: 'Old Dutch number cancelled.',
        submitted: '2026-10-02',
        status: 'approved',
        decision: 'Approved on 2 October 2026. The profile already shows this number.',
      },
    ],
    months: months([
      ['2024-03', 'March', 3200],
      ['2024-04', 'April', 3350],
      ['2024-05', 'May', 3400],
      ['2024-06', 'June', 3600],
      ['2024-07', 'July', 3500],
      ['2024-08', 'August', 3800],
      ['2024-09', 'September', 3700],
      ['2024-10', 'October', 3900],
      ['2024-11', 'November', 3850],
      ['2024-12', 'December', 4100],
      ['2025-01', 'January', 3800],
      ['2025-02', 'February', 3700],
      ['2025-03', 'March', 3950],
      ['2025-04', 'April', 4100],
      ['2025-05', 'May', 4200],
      ['2025-06', 'June', 4300],
      ['2025-07', 'July', 4050],
      ['2025-08', 'August', 4450],
      ['2025-09', 'September', 4400],
      ['2025-10', 'October', 4550],
      ['2025-11', 'November', 4600],
      ['2025-12', 'December', 4900],
      ['2026-01', 'January', 4300],
      ['2026-02', 'February', 4150],
      ['2026-03', 'March', 4500],
      ['2026-04', 'April', 4600],
      ['2026-05', 'May', 4700],
      ['2026-06', 'June', 4900],
      ['2026-07', 'July', 4750],
      ['2026-08', 'August', 5050],
      ['2026-09', 'September', 4950],
      ['2026-10', 'October', 5200],
    ]),
    queries: [
      {
        id: 'q1',
        subject: 'Locker 4 key sticks',
        body: 'The key turns halfway and then stops. I can still get in, but the evening shift cannot.',
        opened: '2026-11-20',
        status: 'open',
        resolution: '',
      },
      {
        id: 'q2',
        subject: 'Replacement uniform trousers',
        body: 'The hem on my pair has gone. Size 38.',
        opened: '2026-10-28',
        status: 'resolved',
        resolution: 'Housekeeping opened a replacement. Collect size 38 from the linen room. Ticket U-204.',
      },
      {
        id: 'q3',
        subject: 'Stillwater against a closing shift',
        body: 'My 12 November session sat on top of close. Who covers the floor if I leave at 17:40?',
        opened: '2026-11-04',
        status: 'resolved',
        resolution: 'Jonas took close that Thursday. Future Stillwater days are now marked on the floor board the Monday before.',
      },
    ],
    escalations: [
      {
        id: 'e1',
        area: 'Equipment',
        urgency: 'High',
        description: 'The diffuser in Suite 2 leaked oil across the stone shelf during the 16:00. The shelf is slick and the unit is still humming.',
        need: 'Take Suite 2 off the book until the shelf is safe, and replace the unit.',
        opened: '2026-11-21',
        status: 'resolved',
        update: 'Suite 2 was closed for the evening. A new diffuser is in, and the shelf was stripped. You can book the room again.',
      },
      {
        id: 'e2',
        area: 'Schedule',
        urgency: 'Medium',
        description: 'After the 21:00 private event last Friday, two juniors were still waiting on a taxi at 22:20.',
        need: 'A booked car for any close after 21:00, arranged before the event, not at the door.',
        opened: '2026-11-16',
        status: 'inreview',
        update: 'People and operations are costing a standing account with the car firm. No date yet.',
      },
    ],
    sessions: [
      {
        id: 's1',
        date: '2026-12-10',
        time: '18:00–18:50',
        with: 'Dr Helen Voss',
        place: 'Quiet Room',
        status: 'upcoming',
        focus: 'Close of cycle. What you want the next eight to hold.',
      },
      {
        id: 's2',
        date: '2026-11-26',
        time: '18:00–18:50',
        with: 'Dr Helen Voss',
        place: 'Quiet Room',
        status: 'upcoming',
        focus: 'Leadership load before the December rush.',
      },
      {
        id: 's3',
        date: '2026-11-12',
        time: '18:00–18:50',
        with: 'Dr Helen Voss',
        place: 'Quiet Room',
        status: 'attended',
        focus: 'Handing the floor on without staying in the doorway.',
      },
      {
        id: 's4',
        date: '2026-10-29',
        time: '18:00–18:50',
        with: 'Dr Helen Voss',
        place: 'Quiet Room',
        status: 'attended',
        focus: 'Fatigue after the late event week.',
      },
      {
        id: 's5',
        date: '2026-10-15',
        time: '18:00–18:50',
        with: 'Dr Helen Voss',
        place: 'Quiet Room',
        status: 'attended',
        focus: 'A guest who stayed past the boundary you set.',
      },
      {
        id: 's6',
        date: '2026-10-01',
        time: '18:00–18:50',
        with: 'Dr Helen Voss',
        place: 'Quiet Room',
        status: 'attended',
        focus: 'What “being the lead” is costing the book.',
      },
      {
        id: 's7',
        date: '2026-09-17',
        time: '18:00–18:50',
        with: 'Dr Helen Voss',
        place: 'Quiet Room',
        status: 'attended',
        focus: 'Sleep, and the mornings that start too sharp.',
      },
      {
        id: 's8',
        date: '2026-09-03',
        time: '18:00–18:50',
        with: 'Dr Helen Voss',
        place: 'Quiet Room',
        status: 'attended',
        focus: 'Opening the cycle. Why you asked for Stillwater.',
      },
    ],
    progress: {
      programme: 'Stillwater',
      cycle: 'Cycle 3',
      attended: 6,
      planned: 8,
      with: 'Dr Helen Voss',
      themes: [
        'Boundaries on a full book',
        'Fatigue after late events',
        'Handing the floor to someone else',
      ],
    },
    sessionNotes: [
      {
        id: 'sn1',
        date: '2026-11-12',
        mood: 'Steady',
        text: 'I named the doorway habit. Helen asked what the floor would do if I actually left. I did not have an answer I trusted. That is the work before Thursday.',
      },
      {
        id: 'sn2',
        date: '2026-10-29',
        mood: 'Heavy',
        text: 'The late event week sat in my shoulders. We did not solve the taxi. We did notice I had stopped eating before the 18:00 sessions.',
      },
    ],
    assignments: [
      {
        id: 'a1',
        title: 'Handing work onward',
        prompt: 'Name three moments this week you passed a task to someone else, and what the floor did after you left it.',
        due: '2026-11-27',
        status: 'open',
        submission: '',
        submittedOn: '',
      },
      {
        id: 'a2',
        title: 'The meal before the session',
        prompt: 'For five working days, note whether you ate before your last guest. No judgement, just the pattern.',
        due: '2026-11-11',
        status: 'submitted',
        submission: 'Mon yes, Tue no, Wed yes, Thu no, Fri no. The no days were the ones with a brief squeezed against a 16:00. I eat when the brief ends on time.',
        submittedOn: '2026-11-11',
      },
    ],
    team: [
      {
        id: 'tr1',
        date: APP_TODAY,
        from: 'Lena Visser',
        floor: 4,
        worked: 'The 11:00 turnover landed on time.',
        fix: 'The 15:00 brief, from walk-ins.',
        shout: 'Tobi reset Suite 2 without being asked.',
      },
      {
        id: 'tr2',
        date: APP_TODAY,
        from: 'Tobi Adeyemi',
        floor: 3,
        worked: 'The oil station stayed stocked through the morning.',
        fix: 'The apothecary count ran long last time. Start it on the hour.',
        shout: 'Amara caught the pressure note before the guest was in the room.',
      },
      {
        id: 'tr3',
        date: '2026-11-23',
        from: 'Amara Cole',
        floor: 4,
        worked: 'Closing rooms were ready by 18:10.',
        fix: 'The diffuser in Suite 2 is still loud even after the leak was cleaned.',
        shout: 'Ife stayed with a nervous first-time guest and did not rush the intake.',
      },
      {
        id: 'tr4',
        date: '2026-11-23',
        from: 'Jonas Bakker',
        floor: 4,
        worked: 'Front desk held a late arrival without moving the whole book.',
        fix: 'Social shots drifted toward the guest corridor. Keep them in the studio.',
        shout: 'Noor, for a calm pregnancy booking.',
      },
    ],
    p2p: [
      {
        id: 'p1',
        date: '2026-11-23',
        from: 'Lena Visser',
        to: 'Amara Cole',
        presence: 5,
        craft: 5,
        teamwork: 4,
        note: 'You slowed the brief when the juniors looked lost. I could repeat it afterwards, which is the test.',
      },
      {
        id: 'p2',
        date: '2026-11-23',
        from: 'Amara Cole',
        to: 'Tobi Adeyemi',
        presence: 4,
        craft: 5,
        teamwork: 5,
        note: 'You took Suite 2 apart after the leak and left it ready. I did not have to check.',
      },
    ],
    attendance: amaraAttendance(),
    seenAnnouncements: ['a-roster', 'a-phones', 'a-heat', 'a-gifts'],
    seenTalk: ['j-playlist', 't-towels', 'lena-1', 'lena-2', 'ife-1', 'ife-2', 'noor-1', 'noor-2', 'amara-noor'],
  }
}

function noorBundle() {
  return {
    messages: [
      {
        id: 'm1',
        kind: 'task',
        taskId: 't1',
        from: 'Floor desk',
        time: '10:10',
        date: APP_TODAY,
        subject: 'Pregnancy booking, left side',
        body: 'Guest R.D. is in Suite 4 at 12:00. Second trimester. She asked to stay on her left side for the longer passes. Cushion is already in the suite.',
        unread: true,
      },
      {
        id: 'm2',
        kind: 'activity',
        activity: 'Learning',
        from: 'People team',
        time: '09:30',
        date: APP_TODAY,
        subject: 'Consent module is open',
        body: 'You finished house foundations. The consent module is the one in front of you now. The first lesson is short enough to do after close.',
        unread: true,
      },
      {
        id: 'm3',
        kind: 'task',
        taskId: 't5',
        from: 'Social lead',
        time: 'Yesterday',
        date: '2026-11-23',
        subject: 'Hands only, please',
        body: 'Today’s social task is a close shot of the scalp oil. Hands and bottle. No face, even yours, unless you want it and the card is in frame.',
        unread: false,
      },
      {
        id: 'm4',
        kind: 'activity',
        activity: 'Stillwater',
        from: 'People team',
        time: 'Monday',
        date: '2026-11-23',
        subject: 'Your next session',
        body: 'Dr Helen Voss can see you on Thursday 26 November at 17:10, before Amara’s hour. Quiet Room. This is session four of eight.',
        unread: false,
      },
    ],
    tasks: [
      {
        id: 't1',
        type: 'session',
        title: 'Pregnancy massage · 60 min',
        time: '12:00–13:00',
        date: APP_TODAY,
        place: 'Suite 4',
        detail: 'Guest R.D. Second trimester. Left-side preference for the longer passes.',
        status: 'assigned',
        channel: '',
        checklist: check(['Cushion set', 'Intake read', 'Left-side plan', 'Temperature checked']),
        notes: [],
      },
      {
        id: 't2',
        type: 'cleaning',
        title: 'Suite 4 reset',
        time: '13:10–13:25',
        date: APP_TODAY,
        place: 'Suite 4',
        detail: 'Short reset. Pregnancy cushion back to the cupboard, linen out, bench clear.',
        status: 'assigned',
        channel: '',
        checklist: check(['Cushion away', 'Linen out', 'Bench clear']),
        notes: [],
      },
      {
        id: 't3',
        type: 'operations',
        title: 'Retail shelf face-up',
        time: '15:00–15:20',
        date: APP_TODAY,
        place: 'Apothecary',
        detail: 'Bring the scalp oil and the pregnancy-safe balm to the front. Do not recount the cupboard. Amara has the count.',
        status: 'assigned',
        channel: '',
        checklist: check(['Scalp oil forward', 'Balm forward', 'Empty testers pulled']),
        notes: [],
      },
      {
        id: 't4',
        type: 'leader',
        title: 'Shadow the 15:00 brief',
        time: '15:00–15:20',
        date: APP_TODAY,
        place: 'Studio',
        detail: 'You are not running it. Listen for how Amara names the cover, and write down one line you would reuse.',
        status: 'assigned',
        channel: '',
        checklist: check(['Present', 'One line written down']),
        notes: [],
      },
      {
        id: 't5',
        type: 'social',
        title: 'Scalp oil, close shot',
        time: '17:30–17:40',
        date: APP_TODAY,
        place: 'Studio',
        detail: 'Hands and bottle only. Send the clip to the social lead before you leave.',
        status: 'assigned',
        channel: 'Instagram stories',
        checklist: check(['Hands only', 'No guest in frame', 'Clip sent']),
        notes: [],
      },
      {
        id: 't6',
        type: 'session',
        title: 'Swedish · 60 min',
        time: '14:00–15:00',
        date: '2026-11-23',
        place: 'Suite 2',
        detail: 'Guest L.P. Quiet session. No add-ons.',
        status: 'done',
        channel: '',
        checklist: check(['Intake', 'Room handed back'], 2),
        notes: [],
      },
      {
        id: 't7',
        type: 'cleaning',
        title: 'Evening linen run',
        time: '18:30–18:45',
        date: '2026-11-23',
        place: 'Linen room',
        detail: 'Two bags down. Nothing left in Suite 4.',
        status: 'done',
        channel: '',
        checklist: check(['Bags down'], 1),
        notes: [],
      },
      {
        id: 't8',
        type: 'social',
        title: 'Window light still',
        time: '11:20–11:30',
        date: '2026-11-22',
        place: 'Reception bench',
        detail: 'The morning flowers, no guests behind them.',
        status: 'done',
        channel: 'Instagram feed',
        checklist: check(['Frame checked', 'Sent'], 2),
        notes: [],
      },
    ],
    applications: [
      {
        id: 'ap1',
        kind: 'funding',
        title: 'Scalp ritual workshop · €240',
        detail: 'A Saturday in December. I would add the short ritual to the 60-minute book.',
        submitted: '2026-11-19',
        status: 'pending',
        decision: 'With the people lead.',
      },
      {
        id: 'ap2',
        kind: 'leave',
        title: 'Annual leave · 4 Dec 2026 to 6 Dec 2026',
        detail: 'Sister’s wedding. Asked before the December book filled.',
        submitted: '2026-10-30',
        status: 'approved',
        decision: 'Approved on 3 November 2026.',
      },
    ],
    modules: [
      {
        id: 'mod1',
        title: 'House foundations',
        summary: 'How Zura opens, closes, and speaks to a guest.',
        status: 'complete',
        progress: 100,
        lessons: [
          { title: 'The Keizersgracht floor', done: true },
          { title: 'Opening and closing', done: true },
          { title: 'How we write a note', done: true },
        ],
      },
      {
        id: 'mod2',
        title: 'Consent and trauma-informed touch',
        summary: 'Asking, stopping, and what a note must hold.',
        status: 'current',
        progress: 35,
        lessons: [
          { title: 'The first question', done: true },
          { title: 'Stopping without fuss', done: false },
          { title: 'Writing what the guest allowed', done: false },
        ],
      },
      {
        id: 'mod3',
        title: 'Pregnancy-safe work, house standard',
        summary: 'The positions and the questions Zura uses on this book.',
        status: 'ahead',
        progress: 0,
        lessons: [
          { title: 'Trimester questions', done: false },
          { title: 'Positions we use', done: false },
        ],
      },
    ],
    certificates: [
      { id: 'c1', title: 'House foundations', issued: '2026-02-20', code: 'ZS-HF-2210' },
    ],
    bioEdits: [
      {
        id: 'be1',
        field: 'address',
        label: 'Home address',
        value: 'Van Ostadestraat 42, 1072 SX Amsterdam',
        reason: 'Moved in October.',
        submitted: '2026-10-11',
        status: 'approved',
        decision: 'Approved on 14 October 2026. The profile shows the new address.',
      },
    ],
    months: months([
      ['2026-01', 'January', 2900],
      ['2026-02', 'February', 2800],
      ['2026-03', 'March', 3050],
      ['2026-04', 'April', 3100],
      ['2026-05', 'May', 3200],
      ['2026-06', 'June', 3300],
      ['2026-07', 'July', 3150],
      ['2026-08', 'August', 3400],
      ['2026-09', 'September', 3350],
      ['2026-10', 'October', 3500],
    ]),
    queries: [
      {
        id: 'q1',
        subject: 'Where the pregnancy cushions live',
        body: 'I found one in Suite 4 and one in the linen room. Which is the spare, and who refills the cover?',
        opened: '2026-11-18',
        status: 'resolved',
        resolution: 'Suite 4 holds the one in use. The linen-room cushion is the spare. Housekeeping washes the cover on Mondays. Ask them if you use the spare.',
      },
      {
        id: 'q2',
        subject: 'Late book on a Stillwater day',
        body: 'If my Thursday session is at 17:10, can I still be given a 16:00 guest?',
        opened: '2026-11-22',
        status: 'open',
        resolution: '',
      },
    ],
    escalations: [
      {
        id: 'e1',
        area: 'Guest care',
        urgency: 'Medium',
        description: 'A guest arrived already in pain and the intake had no pregnancy question, even though the booking note said second trimester. I caught it in the room.',
        need: 'The pregnancy question on every intake, not only when the guest remembers to say it at the desk.',
        opened: '2026-11-09',
        status: 'inreview',
        update: 'The desk is rewriting the intake card. You will see the new card before December.',
      },
    ],
    sessions: [
      {
        id: 's1',
        date: '2026-12-10',
        time: '17:10–18:00',
        with: 'Dr Helen Voss',
        place: 'Quiet Room',
        status: 'upcoming',
        focus: 'How the new book is sitting in the body.',
      },
      {
        id: 's2',
        date: '2026-11-26',
        time: '17:10–18:00',
        with: 'Dr Helen Voss',
        place: 'Quiet Room',
        status: 'upcoming',
        focus: 'Asking for help before the room goes quiet.',
      },
      {
        id: 's3',
        date: '2026-11-12',
        time: '17:10–18:00',
        with: 'Dr Helen Voss',
        place: 'Quiet Room',
        status: 'attended',
        focus: 'The first month you stopped checking every note twice.',
      },
      {
        id: 's4',
        date: '2026-10-29',
        time: '17:10–18:00',
        with: 'Dr Helen Voss',
        place: 'Quiet Room',
        status: 'attended',
        focus: 'A guest who cried. What you did, and what you carried home.',
      },
      {
        id: 's5',
        date: '2026-10-15',
        time: '17:10–18:00',
        with: 'Dr Helen Voss',
        place: 'Quiet Room',
        status: 'attended',
        focus: 'Starting the cycle. What you want from eight sessions.',
      },
    ],
    progress: {
      programme: 'Stillwater',
      cycle: 'Cycle 1',
      attended: 3,
      planned: 8,
      with: 'Dr Helen Voss',
      themes: ['Asking before you are stuck', 'Leaving a session at the door', 'A full book and a new house'],
    },
    sessionNotes: [
      {
        id: 'sn1',
        date: '2026-11-12',
        mood: 'Light',
        text: 'I told Helen I checked a note three times and then trusted it. Small. It still counts. She asked me to notice the next time I do not check.',
      },
    ],
    assignments: [
      {
        id: 'a1',
        title: 'One ask',
        prompt: 'Before Thursday, ask one colleague for a specific kind of help. Write what you asked, and what they did.',
        due: '2026-11-26',
        status: 'open',
        submission: '',
        submittedOn: '',
      },
      {
        id: 'a2',
        title: 'Leaving it at the door',
        prompt: 'After one session that stays with you, write four lines on what you are putting down before you get on the tram.',
        due: '2026-11-10',
        status: 'submitted',
        submission: 'The guest who cried. I walked to the corner before I looked at my phone. I ate the apple in my locker. I told Tobi I was fine and then told him I was not, in one sentence. The tram was easier.',
        submittedOn: '2026-11-10',
      },
    ],
    team: [
      {
        id: 'tr-lena',
        date: APP_TODAY,
        from: 'Lena Visser',
        floor: 4,
        worked: 'The 11:00 turnover landed on time.',
        fix: 'The 15:00 brief, from walk-ins.',
        shout: 'Tobi reset Suite 2 without being asked.',
      },
      {
        id: 'tr-amara-today',
        date: APP_TODAY,
        from: 'Amara Cole',
        floor: 4,
        worked: 'The pressure note reached Suite 3 before the guest.',
        fix: 'Keep social filming inside the studio.',
        shout: 'Noor, for catching a thin intake on a pregnancy booking last week.',
      },
      {
        id: 'tr-noor',
        date: '2026-11-23',
        from: 'Noor Vermeer',
        floor: 4,
        worked: 'Suite 4 was calm all afternoon.',
        fix: 'The spare pregnancy cushion was missing its cover.',
        shout: 'Ife, for staying late on the books so I could leave on time.',
      },
    ],
    p2p: [
      {
        id: 'p-noor',
        date: '2026-11-22',
        from: 'Amara Cole',
        to: 'Noor Vermeer',
        presence: 5,
        craft: 4,
        teamwork: 5,
        note: 'You asked for the cushion before the guest arrived, not during. That is the whole job.',
      },
    ],
    attendance: noorAttendance(),
    seenAnnouncements: ['a-roster', 'a-phones', 'a-heat', 'a-gifts'],
    seenTalk: ['j-playlist', 't-towels', 'lena-1', 'lena-2', 'ife-1', 'ife-2', 'noor-1', 'noor-2', 'noor-amara'],
  }
}

export function createBundle(id) {
  if (id === 'ZURA-2207') return noorBundle()
  return amaraBundle()
}

export const ANNOUNCE_NEW_FROM = '2026-11-17'

export function unreadAnnouncements(announcements, seen) {
  const read = new Set(seen || [])
  return (announcements || []).filter((item) => !read.has(item.id))
}

export function unreadTalk(messages, name, seen) {
  const read = new Set(seen || [])
  return (messages || []).filter((item) => {
    if (item.from === name || read.has(item.id)) return false
    if (item.kind === 'public') return true
    return item.to === name
  })
}

export function announcements() {
  return [
    {
      id: 'a-oil',
      date: '2026-11-24',
      time: '08:10',
      from: 'House desk',
      title: 'Sweet almond is on the last tin',
      body: 'The apothecary has one tin of sweet almond left. Use grapeseed for body work until the delivery at 15:00. Facial oils are untouched. If a guest has a nut note, tell the desk before the booking so the suite can be moved.',
    },
    {
      id: 'a-sunday',
      date: '2026-11-24',
      time: '07:40',
      from: 'Lena Visser',
      title: 'December Sundays need two more hands',
      body: 'The Sunday book in December is already past a single therapist. Put your name beside 6, 13, or 20 December on the studio wall if you can work one. The 27th stays closed.',
    },
    {
      id: 'a-roster',
      date: '2026-11-20',
      time: '18:05',
      from: 'House desk',
      title: 'Winter roster is on the studio wall',
      body: 'January’s draft is pinned beside the kettle. Read your own lines before Friday and tell Lena if a date is wrong. It stays a draft until 28 November.',
    },
    {
      id: 'a-phones',
      date: '2026-11-12',
      time: '09:00',
      from: 'House desk',
      title: 'Phones stay in the locker',
      body: 'Filming for the house account happens in the studio, with the door shut. Phones do not come onto the guest corridor, even between bookings.',
    },
    {
      id: 'a-heat',
      date: '2026-10-28',
      time: '14:20',
      from: 'Jonas Bakker',
      title: 'Suite 2 heating is back',
      body: 'The suite holds temperature again. Give it ten minutes before a hot-stone booking. The diffuser was cleaned the same afternoon and should stay quiet.',
    },
    {
      id: 'a-gifts',
      date: '2026-10-02',
      time: '08:30',
      from: 'House desk',
      title: 'Guest gifts stay at the desk',
      body: 'If a guest brings something for a therapist, it waits at the desk until the end of the shift. Nothing is opened in the suite.',
    },
  ]
}

export function talk() {
  return [
    {
      id: 'j-playlist',
      kind: 'public',
      from: 'Jonas Bakker',
      to: '',
      date: '2026-11-18',
      time: '17:40',
      text: 'The corridor speaker is on the winter list. Leave it there.',
    },
    {
      id: 'lena-1',
      kind: 'direct',
      from: 'Lena Visser',
      to: 'Amara Cole',
      date: '2026-11-21',
      time: '15:05',
      text: 'Can you take the 15:00 brief on Tuesday? I am in a supplier call.',
    },
    {
      id: 'lena-2',
      kind: 'direct',
      from: 'Amara Cole',
      to: 'Lena Visser',
      date: '2026-11-21',
      time: '15:18',
      text: 'Yes. I will keep it to twenty minutes.',
    },
    {
      id: 'ife-1',
      kind: 'direct',
      from: 'Ife Salami',
      to: 'Noor Vermeer',
      date: '2026-11-22',
      time: '19:10',
      text: 'I covered your 18:00 on the 18th. The guest was happy with the shorter scalp.',
    },
    {
      id: 'ife-2',
      kind: 'direct',
      from: 'Noor Vermeer',
      to: 'Ife Salami',
      date: '2026-11-22',
      time: '19:22',
      text: 'I owe you a coffee. Thank you for staying.',
    },
    {
      id: 't-towels',
      kind: 'public',
      from: 'Tobi Adeyemi',
      to: '',
      date: '2026-11-22',
      time: '17:10',
      text: 'Suite 2 towels are in the warmer. Help yourselves before the evening book.',
    },
    {
      id: 'noor-1',
      kind: 'direct',
      from: 'Noor Vermeer',
      to: 'Amara Cole',
      date: '2026-11-23',
      time: '16:40',
      text: 'The pregnancy cushion cover is back on the spare. I left it in Suite 4.',
    },
    {
      id: 'noor-2',
      kind: 'direct',
      from: 'Amara Cole',
      to: 'Noor Vermeer',
      date: '2026-11-23',
      time: '16:52',
      text: 'Thank you. I will tell the morning book.',
    },
    {
      id: 'walk',
      kind: 'public',
      from: 'Lena Visser',
      to: '',
      date: '2026-11-24',
      time: '08:20',
      text: 'Walk-ins are paused until 11:00. The 10:30 couple needs both suites.',
    },
    {
      id: 'amara-noor',
      kind: 'direct',
      from: 'Amara Cole',
      to: 'Noor Vermeer',
      date: '2026-11-24',
      time: '09:05',
      text: 'If the 14:00 runs long, Ife can take the reset. Do not skip your break.',
    },
    {
      id: 'noor-amara',
      kind: 'direct',
      from: 'Noor Vermeer',
      to: 'Amara Cole',
      date: '2026-11-24',
      time: '10:40',
      text: 'The 14:00 guest asked for lighter pressure. I wrote it on the card.',
    },
  ]
}

function comment(id, from, text, date, time) {
  return { id, from, text, date, time }
}

export function posts() {
  return [
    {
      id: 'p-task-amara',
      label: 'task',
      from: 'Floor desk',
      to: 'Amara Cole',
      date: '2026-11-24',
      time: '08:40',
      title: 'Deep tissue at 10:00, lighter through the neck',
      body: 'Guest A.O. is back in Suite 3 for 90 minutes. Last visit they asked for lighter work through the neck and jaw. The intake card is already on the suite bench.',
      comments: [
        comment('c-task-amara', 'Amara Cole', 'Read the card. Oil is warming now.', '2026-11-24', '09:02'),
      ],
    },
    {
      id: 'p-task-noor',
      label: 'task',
      from: 'Floor desk',
      to: 'Noor Vermeer',
      date: '2026-11-24',
      time: '10:10',
      title: 'Pregnancy booking, stay on the left side',
      body: 'Guest R.D. is in Suite 4 at 12:00. Second trimester. She asked to stay on her left side for the longer passes. The cushion is already in the suite.',
      comments: [],
    },
    {
      id: 'p-group-sundays',
      label: 'group',
      from: 'Lena Visser',
      to: '',
      date: '2026-11-24',
      time: '07:40',
      title: 'December Sundays need two more hands',
      body: 'The Sunday book in December is already past a single therapist. Put your name beside 6, 13, or 20 December on the studio wall if you can work one. The 27th stays closed.',
      comments: [
        comment('c-sun-tobi', 'Tobi Adeyemi', 'I can take the 13th.', '2026-11-24', '08:55'),
      ],
    },
    {
      id: 'p-group-brief',
      label: 'group',
      from: 'Jonas Bakker',
      to: '',
      date: '2026-11-24',
      time: '09:05',
      title: 'The 15:00 brief still happens',
      body: 'Hold it even if the book is busy. Cover the late arrival, who resets Suite 2, and who is on the door at close. Noor is shadowing, not running it.',
      comments: [],
    },
    {
      id: 'p-query-locker',
      label: 'query',
      from: 'Amara Cole',
      to: '',
      date: '2026-11-20',
      time: '11:15',
      title: 'Locker 4 key sticks',
      body: 'The key turns halfway and then stops. I can still get in, but the evening shift cannot. Is this a new barrel or a temporary locker?',
      comments: [
        comment(
          'c-locker',
          'Jonas Bakker',
          'Facilities has the lock. They will be in before Thursday close. Use locker 6 until then.',
          '2026-11-21',
          '09:30',
        ),
      ],
    },
    {
      id: 'p-sanction-film',
      label: 'sanction',
      from: 'House desk',
      to: '',
      date: '2026-11-22',
      time: '19:20',
      title: 'Guest corridor was filmed',
      body: 'A story cut from 22 November included the guest corridor. The file was deleted the same hour. This is a recorded sanction for the floor: filming stays in the studio, with the door shut. The next corridor cut is a formal warning for the person holding the phone.',
      comments: [
        comment('c-sanction', 'Lena Visser', 'I have said it again at the brief. Studio only.', '2026-11-23', '09:10'),
      ],
    },
    {
      id: 'p-remind-oil',
      label: 'reminder',
      from: 'House desk',
      to: '',
      date: '2026-11-24',
      time: '08:10',
      title: 'Sweet almond is on the last tin',
      body: 'Use grapeseed for body work until the delivery at 15:00. Facial oils are untouched. If a guest has a nut note, tell the desk before the booking so the suite can be moved.',
      comments: [],
    },
    {
      id: 'p-remind-break',
      label: 'reminder',
      from: 'Amara Cole',
      to: '',
      date: '2026-11-24',
      time: '09:12',
      title: 'Breaks still happen on a full book',
      body: 'If the 14:00 runs long, Ife can take the reset. Do not skip the break between suites.',
      comments: [
        comment('c-break', 'Noor Vermeer', 'Noted. I will hand the reset over if we slip.', '2026-11-24', '10:44'),
      ],
    },
    {
      id: 'p-session-amara',
      label: 'session',
      from: 'People team',
      to: 'Amara Cole',
      date: '2026-11-23',
      time: '16:00',
      title: 'Stillwater · Thursday 26 November',
      body: 'Dr Helen Voss, 18:00–18:50, Quiet Room. Focus: leadership load before the December rush. If the floor runs late, text the people desk before 17:00 and they will hold the room for fifteen minutes.',
      comments: [],
    },
    {
      id: 'p-session-noor',
      label: 'session',
      from: 'People team',
      to: 'Noor Vermeer',
      date: '2026-11-23',
      time: '16:05',
      title: 'Stillwater · Thursday 26 November',
      body: 'Dr Helen Voss, 17:10–18:00, Quiet Room, before Amara’s hour. This is session four of eight. Focus: asking for help before the room goes quiet.',
      comments: [],
    },
  ]
}

export function reports() {
  return [
    {
      id: 'r1',
      date: '2026-11-24',
      time: '08:05',
      from: 'Lena Visser',
      title: 'Opening report',
      body: 'Both suites were ready. Walk-ins are paused until 11:00 for the couple booking. Sweet almond is on the last tin, so grapeseed is out for body work.',
    },
    {
      id: 'r2',
      date: '2026-11-23',
      time: '18:20',
      from: 'Amara Cole',
      title: 'Close of day',
      body: 'Rooms were ready by 18:10. The pressure note reached Suite 3 before the guest. Social filming stayed in the studio after yesterday’s drift toward the corridor.',
    },
    {
      id: 'r3',
      date: '2026-11-22',
      time: '19:05',
      from: 'Jonas Bakker',
      title: 'Corridor filming',
      body: 'A story cut included the guest corridor. The file was deleted the same hour. The sanction is on the posts timeline. The studio door stays shut for any house filming.',
    },
    {
      id: 'r4',
      date: '2026-11-21',
      time: '17:40',
      from: 'House desk',
      title: 'Suite 2 after the leak',
      body: 'Suite 2 was off the book for the evening. The shelf was stripped and the diffuser replaced. The room is bookable again. Tobi closed the reset without being asked.',
    },
    {
      id: 'r5',
      date: '2026-11-18',
      time: '09:10',
      from: 'House desk',
      title: 'Cover for an absence',
      body: 'Amara called at 07:20 and the book was covered. Noor’s absence the same day was covered before ten. Both sit on the attendance record.',
    },
  ]
}

export function createHouse() {
  const amara = amaraBundle()
  const noor = noorBundle()
  return {
    team: [...amara.team, ...noor.team.filter((item) => item.from === 'Noor Vermeer')],
    p2p: [...amara.p2p, ...noor.p2p],
    announcements: announcements(),
    talk: talk(),
    posts: posts(),
    reports: reports(),
  }
}

export function uid() {
  return Math.random().toString(36).slice(2, 9)
}
