import type { en } from './en'

export const es: typeof en = {
  documentTitle: 'Quantum Lab: Simulaciones interactivas',
  nav: {
    label: 'Principal',
    home: 'Inicio',
    lab: 'Laboratorio',
    articles: 'Artículos explicados visualmente',
    learn: 'Aprender',
  },
  menu: {
    open: 'Abrir menú',
    close: 'Cerrar menú',
    collapse: 'Contraer menú',
    expand: 'Expandir menú',
  },
  theme: {
    label: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
    current: 'Tema: {{current}}',
    switch: 'Tema: {{current}}. Cambiar a {{next}}',
  },
  language: {
    label: 'Idioma',
    current: 'Idioma: {{current}}',
    switch: 'Idioma: {{current}}. Cambiar a {{next}}',
  },
  header: { badge: 'Pedagogía cuántica' },
  footer: { credit: 'Quantum Lab • Física cuántica matemática' },
  comingSoon: {
    title: 'Próximamente',
    explore: 'Mientras tanto, explora el laboratorio →',
  },
  articles: {
    title: 'Artículos',
    highlight: 'explicados visualmente',
    description:
      'Artículos de investigación explicados con visualizaciones y organizados por tema, para que los entiendas sin leer el artículo completo.',
  },
  learn: {
    title: 'Aprende',
    highlight: 'computación cuántica',
    description:
      'Lecciones estructuradas por tema desde los fundamentos: qubits, medición y más.',
  },
  lab: {
    title: 'Quantum Lab:',
    highlight: 'Simulaciones interactivas',
    description:
      'Una colección de visualizaciones animadas, paso a paso, para explorar las ideas centrales de la computación cuántica. Cada simulación puede exportar un GIF en bucle para tus diapositivas.',
    tipLabel: 'Consejo:',
    tip: 'Cada simulación incluye controles de reproducción y un exportador de GIF listo para presentaciones.',
  },
  notFound: { title: 'Página no encontrada' },
  backToLab: '← Todas las simulaciones',
  load: {
    loading: 'Cargando simulación…',
    failed:
      'No se pudo cargar esta simulación. Revisa tu conexión; es posible que el sitio se haya actualizado.',
    reload: 'Recargar página',
  },
}
