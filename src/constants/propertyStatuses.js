const PROPERTY_STATUSES = Object.freeze({
  DISPONIBLES: 'disponibles',
  EN_RESERVA: 'en reserva',
  RESERVADOS: 'reservados',
  CERRADOS: 'cerrados'
})

const ALLOWED_STATUSES = Object.values(PROPERTY_STATUSES)

module.exports = { PROPERTY_STATUSES, ALLOWED_STATUSES }
