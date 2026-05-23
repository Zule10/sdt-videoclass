import { useState } from 'react'
import './App.css'

type AttachmentType = 'video' | 'imagen'

type Course = {
  id: number
  title: string
  level: string
  instructor: string
  progress: number
  nextClass: string
  color: string
}

type Lesson = {
  id: number
  courseId: number
  title: string
  duration: string
  uploadedAt: string
  description: string
  videoUrl: string
  comments: Comment[]
}

type Comment = {
  id: number
  author: string
  timestamp: string
  text: string
}

type Question = {
  id: number
  courseId: number
  lessonTitle: string
  student: string
  text: string
  attachmentType?: AttachmentType
  attachmentName?: string
  status: 'Nueva' | 'En revisión'
}

const courses: Course[] = [
  {
    id: 1,
    title: 'Timba Cubana - Fundamentos',
    level: 'Nivel inicial',
    instructor: 'Profe Daniel',
    progress: 68,
    nextClass: 'Clase 08 · Musicalidad y contratiempo',
    color: '#f97316',
  },
  {
    id: 2,
    title: 'Rueda de Casino Intermedio',
    level: 'Nivel intermedio',
    instructor: 'Profe Laura',
    progress: 42,
    nextClass: 'Clase 05 · Enchufla doble con estilo',
    color: '#14b8a6',
  },
  {
    id: 3,
    title: 'Body Movement para Timba',
    level: 'Técnica corporal',
    instructor: 'Profe Miguel',
    progress: 84,
    nextClass: 'Clase 11 · Acentos de hombros y torso',
    color: '#8b5cf6',
  },
]

const lessons: Lesson[] = [
  {
    id: 101,
    courseId: 1,
    title: 'Clase 07 · Pasos libres y cambios de energía',
    duration: '48 min',
    uploadedAt: 'Subido hace 2 días',
    description:
      'Repaso completo de pasos libres para conectar mejor con los cambios de la música timbera.',
    videoUrl:
      'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    comments: [
      {
        id: 1,
        author: 'Camila R.',
        timestamp: '12:24',
        text: 'En el minuto 12 me funcionó practicar el cambio de peso más lento.',
      },
      {
        id: 2,
        author: 'Andrés M.',
        timestamp: '31:08',
        text: '¿Podemos repetir la combinación con despelote en la próxima clase?',
      },
    ],
  },
  {
    id: 102,
    courseId: 2,
    title: 'Clase 04 · Señales, conteo y rotación de parejas',
    duration: '52 min',
    uploadedAt: 'Subido hace 5 días',
    description:
      'Trabajo de coordinación grupal para entrar y salir de figuras sin perder el conteo.',
    videoUrl:
      'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    comments: [
      {
        id: 3,
        author: 'Sofía L.',
        timestamp: '18:45',
        text: 'La explicación de la señal con mano derecha quedó muy clara.',
      },
    ],
  },
  {
    id: 103,
    courseId: 3,
    title: 'Clase 10 · Aislamientos de torso para marcar la percusión',
    duration: '39 min',
    uploadedAt: 'Subido ayer',
    description:
      'Ejercicios progresivos para mejorar control del torso, hombros y cabeza sobre la clave.',
    videoUrl:
      'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    comments: [
      {
        id: 4,
        author: 'Valentina P.',
        timestamp: '06:12',
        text: 'Este calentamiento me ayudó a soltar más el cuello.',
      },
    ],
  },
]

const initialQuestions: Question[] = [
  {
    id: 201,
    courseId: 1,
    lessonTitle: 'Clase 07 · Pasos libres y cambios de energía',
    student: 'Natalia Gómez',
    text: 'Subí un video practicando el paso. ¿Puedes revisar si estoy entrando tarde al contratiempo?',
    attachmentType: 'video',
    attachmentName: 'practica-contratiempo.mp4',
    status: 'Nueva',
  },
  {
    id: 202,
    courseId: 3,
    lessonTitle: 'Clase 10 · Aislamientos de torso para marcar la percusión',
    student: 'Mario Peña',
    text: 'Adjunto una imagen de la postura final para saber si la línea del torso está correcta.',
    attachmentType: 'imagen',
    attachmentName: 'postura-torso.jpg',
    status: 'En revisión',
  },
]

function App() {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0].id)
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0].id)
  const [commentText, setCommentText] = useState('')
  const [questionText, setQuestionText] = useState('')
  const [questions, setQuestions] = useState(initialQuestions)

  const selectedCourse =
    courses.find((course) => course.id === selectedCourseId) ?? courses[0]
  const courseLessons = lessons.filter(
    (lesson) => lesson.courseId === selectedCourseId,
  )
  const selectedLesson =
    courseLessons.find((lesson) => lesson.id === selectedLessonId) ??
    courseLessons[0]
  const teacherQuestions = questions.filter(
    (question) => question.courseId === selectedCourseId,
  )

  const handleCourseSelect = (courseId: number) => {
    setSelectedCourseId(courseId)
    const firstLesson = lessons.find((lesson) => lesson.courseId === courseId)
    if (firstLesson) {
      setSelectedLessonId(firstLesson.id)
    }
  }

  const handleSendQuestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const attachment = formData.get('attachment') as File | null
    const trimmedQuestion = questionText.trim()

    if (!trimmedQuestion || !selectedLesson) {
      return
    }

    const attachmentType = attachment?.type.startsWith('video')
      ? 'video'
      : attachment?.type.startsWith('image')
        ? 'imagen'
        : undefined

    setQuestions((currentQuestions) => [
      {
        id: Date.now(),
        courseId: selectedCourseId,
        lessonTitle: selectedLesson.title,
        student: 'Tú',
        text: trimmedQuestion,
        attachmentType,
        attachmentName: attachment?.name,
        status: 'Nueva',
      },
      ...currentQuestions,
    ])

    setQuestionText('')
    event.currentTarget.reset()
  }

  const visibleComments = selectedLesson?.comments ?? []

  return (
    <main className="app-shell">
      <section className="hero-section">
        <nav className="topbar" aria-label="Navegación principal">
          <div>
            <span className="brand-mark">SDT</span>
            <span className="brand-name">Son de Timba VideoClass</span>
          </div>
          <a className="teacher-link" href="#teacher-panel">
            Panel profesor
          </a>
        </nav>

        <div className="hero-content">
          <span className="eyebrow">Academia de baile son de timba</span>
          <h1>Aprende, repasa y pregunta desde cada video de clase.</h1>
          <p>
            Una plataforma para estudiantes que cursan timba, rueda y técnica:
            acceden a sus cursos, ven clases grabadas, comentan momentos clave y
            envían preguntas al profesor con imágenes o videos de práctica.
          </p>
          <div className="hero-actions">
            <a href="#courses">Ver mis cursos</a>
            <a href="#questions" className="secondary-action">
              Hacer pregunta
            </a>
          </div>
        </div>
      </section>

      <section className="dashboard-grid" id="courses">
        <aside className="course-list" aria-label="Cursos activos">
          <div className="section-heading">
            <span>Mis cursos</span>
            <h2>Cursos en progreso</h2>
          </div>

          {courses.map((course) => (
            <button
              type="button"
              className={`course-card ${
                selectedCourseId === course.id ? 'active' : ''
              }`}
              key={course.id}
              onClick={() => handleCourseSelect(course.id)}
            >
              <span
                className="course-accent"
                style={{ backgroundColor: course.color }}
              />
              <span className="course-title">{course.title}</span>
              <span>{course.level}</span>
              <span>{course.instructor}</span>
              <span className="progress-bar" aria-hidden="true">
                <span style={{ width: `${course.progress}%` }} />
              </span>
              <strong>{course.progress}% completado</strong>
            </button>
          ))}
        </aside>

        <section className="video-panel" aria-label="Clase seleccionada">
          <div className="lesson-header">
            <div>
              <span className="eyebrow">{selectedCourse.title}</span>
              <h2>{selectedLesson?.title}</h2>
              <p>{selectedLesson?.description}</p>
            </div>
            <span className="duration-pill">
              {selectedLesson?.duration} · {selectedLesson?.uploadedAt}
            </span>
          </div>

          <video
            className="lesson-video"
            controls
            poster="https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1200&q=80"
          >
            <source src={selectedLesson?.videoUrl} type="video/mp4" />
            Tu navegador no soporta reproducción de video.
          </video>

          <div className="lesson-selector">
            {courseLessons.map((lesson) => (
              <button
                type="button"
                className={selectedLessonId === lesson.id ? 'active' : ''}
                key={lesson.id}
                onClick={() => setSelectedLessonId(lesson.id)}
              >
                <strong>{lesson.title}</strong>
                <span>{lesson.duration}</span>
              </button>
            ))}
          </div>
        </section>
      </section>

      <section className="interaction-grid">
        <article className="card" id="comments">
          <div className="section-heading">
            <span>Comentarios del video</span>
            <h2>Discusión de la clase</h2>
          </div>

          <form
            className="inline-form"
            onSubmit={(event) => {
              event.preventDefault()
              setCommentText('')
            }}
          >
            <label htmlFor="comment">Comentar sobre este video</label>
            <textarea
              id="comment"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Ej: En el minuto 18 no entendí el cambio de peso..."
            />
            <button type="submit">Publicar comentario</button>
          </form>

          <div className="comment-list">
            {visibleComments.map((comment) => (
              <div className="comment-item" key={comment.id}>
                <span>{comment.timestamp}</span>
                <strong>{comment.author}</strong>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="card" id="questions">
          <div className="section-heading">
            <span>Preguntas al profesor</span>
            <h2>Envía dudas con evidencia</h2>
          </div>

          <form className="question-form" onSubmit={handleSendQuestion}>
            <label htmlFor="question">Pregunta para {selectedCourse.instructor}</label>
            <textarea
              id="question"
              value={questionText}
              onChange={(event) => setQuestionText(event.target.value)}
              placeholder="Describe qué parte de la clase quieres que el profesor revise..."
            />
            <label htmlFor="attachment">Adjuntar imagen o video</label>
            <input
              id="attachment"
              name="attachment"
              type="file"
              accept="image/*,video/*"
            />
            <button type="submit">Enviar pregunta</button>
          </form>
        </article>
      </section>

      <section className="teacher-panel" id="teacher-panel">
        <div className="section-heading">
          <span>Vista profesor</span>
          <h2>Preguntas de las clases que dirige</h2>
          <p>{selectedCourse.instructor} puede revisar dudas, imágenes y videos.</p>
        </div>

        <div className="teacher-question-list">
          {teacherQuestions.map((question) => (
            <article className="teacher-question" key={question.id}>
              <div>
                <span>{question.status}</span>
                <strong>{question.student}</strong>
              </div>
              <h3>{question.lessonTitle}</h3>
              <p>{question.text}</p>
              {question.attachmentName && (
                <span className="attachment-chip">
                  {question.attachmentType === 'video' ? 'Video' : 'Imagen'} ·{' '}
                  {question.attachmentName}
                </span>
              )}
              <button type="button">Responder / dar review</button>
            </article>
          ))}
        </div>

        <div className="next-class-card">
          <span>Próxima clase</span>
          <strong>{selectedCourse.nextClass}</strong>
          <p>
            Las nuevas grabaciones aparecerán automáticamente en el curso del
            estudiante cuando el profesor las publique.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
