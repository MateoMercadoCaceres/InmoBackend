const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'InmoBackend API',
      version: '1.0.0',
      description: 'Real estate property management REST API'
    },
    servers: [{ url: '/api', description: 'API base' }],
    components: {
      schemas: {
        Property: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            type_id: { type: 'integer', example: 2 },
            user_id: { type: 'integer', example: 1 },
            captor: { type: 'string', example: 'Juan Pérez' },
            description: { type: 'string', example: 'Casa en zona norte' },
            availability_status: {
              type: 'string',
              enum: ['disponibles', 'en reserva', 'reservados', 'cerrados']
            },
            square_meters: { type: 'number', example: 120.5 },
            capturing_agent: { type: 'string', example: 'Agente A' },
            selling_agent: { type: 'string', example: 'Agente B' },
            observations: { type: 'string' },
            capture_date: { type: 'string', format: 'date', example: '2024-01-15' },
            closing_date: { type: 'string', format: 'date', example: '2024-06-30' },
            priority: { type: 'integer', enum: [1, 2, 3], example: 1 },
            ad_image_available: { type: 'boolean', example: false },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        PropertyInput: {
          type: 'object',
          required: ['type_id', 'captor', 'description', 'availability_status'],
          properties: {
            type_id: { type: 'integer', example: 2 },
            user_id: { type: 'integer', example: 1 },
            captor: { type: 'string', example: 'Juan Pérez' },
            description: { type: 'string', example: 'Casa en zona norte' },
            availability_status: {
              type: 'string',
              enum: ['disponibles', 'en reserva', 'reservados', 'cerrados']
            },
            square_meters: { type: 'number', example: 120.5 },
            capturing_agent: { type: 'string' },
            selling_agent: { type: 'string' },
            observations: { type: 'string' },
            capture_date: { type: 'string', format: 'date' },
            closing_date: { type: 'string', format: 'date' },
            priority: { type: 'integer', enum: [1, 2, 3] },
            ad_image_available: { type: 'boolean', default: false }
          }
        },
        StatusUpdate: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['disponibles', 'en reserva', 'reservados', 'cerrados']
            },
            user_id: { type: 'integer', description: 'ID of the user responsible for the change' }
          }
        },
        Media: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            property_id: { type: 'integer', example: 5 },
            media_type: { type: 'string', enum: ['photo', 'video'] },
            media_folder_url: { type: 'string', example: 'https://drive.google.com/drive/folders/abc123' }
          }
        },
        MediaInput: {
          type: 'object',
          required: ['property_id', 'media_type', 'media_folder_url'],
          properties: {
            property_id: { type: 'integer', example: 5 },
            media_type: { type: 'string', enum: ['photo', 'video'] },
            media_folder_url: { type: 'string', example: 'https://drive.google.com/drive/folders/abc123' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'María García' },
            email: { type: 'string', format: 'email', example: 'maria@inmobiliaria.com' },
            role: { type: 'string', enum: ['admin', 'editor'] }
          }
        },
        UserInput: {
          type: 'object',
          required: ['name', 'email', 'role'],
          properties: {
            name: { type: 'string', example: 'María García' },
            email: { type: 'string', format: 'email', example: 'maria@inmobiliaria.com' },
            role: { type: 'string', enum: ['admin', 'editor'] }
          }
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 42 }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Resource not found' }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        BadRequest: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        InternalError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
}

module.exports = swaggerJsdoc(options)
