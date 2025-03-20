'use client'
import Form from '@rjsf/core'
import { IChangeEvent } from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { miniPcSchema } from '../../app/minipcs/form/schema'

import './style.css'

const ArrayFieldTemplate = ({ items, canAdd, onAddClick, schema }) => {
  const title = schema.title || 'Elemento' // Usa el título del schema o un valor por defecto

  return (
    <div className="w-full space-y-4">
      <h2 className="form-title">{title}s</h2>
      {items.map((element) => (
        <div key={element.index} className="rounded-md border bg-gray-100 p-4 dark:bg-gray-800">
          {element.children}
          <button
            type="button"
            className="mt-2 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
            onClick={() => {
              if (window.confirm(`¿Seguro que quieres eliminar ${title}-${element.index + 1}?`)) {
                element.onDropIndexClick(element.index)()
              }
            }}
          >
            Eliminar {title}
          </button>
        </div>
      ))}
      {canAdd && (
        <button
          type="button"
          className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
          onClick={onAddClick}
        >
          Agregar {title}
        </button>
      )}
    </div>
  )
}

const uiSchema = {
  'ui:submitButtonOptions': {
    norender: false,
    submitText: 'Registrar Mini PC',
    props: {
      className:
        'w-full bg-primary-600 hover:bg-primary-700 text-white dark:text-gray-900 font-semibold py-2 px-4 rounded-md',
    },
  },
  variants: {
    'ui:ArrayFieldTemplate': ArrayFieldTemplate,
    items: {
      offers: {
        'ui:ArrayFieldTemplate': ArrayFieldTemplate,
      },
    },
  },
}

const generateId = (brand: string, model: string) => {
  if (!brand || !model) return ''
  return `${brand}${model}`.replace(/[^A-Za-z0-9-]/g, '') // Mantiene mayúsculas
}

const generateTitle = (brand: string, model: string) => {
  if (!brand || !model) return ''
  return `${brand} ${model.replace(/[^A-Za-z0-9-]/g, '')}` // Mantiene mayúsculas
}

const handleChange = ({ formData, errors }: IChangeEvent) => {
  if (formData.brand && formData.model) {
    formData.id = generateId(formData.brand, formData.model)
    formData.title = generateTitle(formData.brand, formData.model)
  }
}

const onSubmit = (data: IChangeEvent) => {
  console.log('Mini PC Registrado:', data.formData)
}

export default function MiniPcForm() {
  return (
    <Form
      schema={miniPcSchema}
      uiSchema={uiSchema}
      validator={validator}
      onChange={handleChange} // ✅ Actualiza el id y title dinámicamente
      onSubmit={onSubmit}
      className="rounded-lg bg-white p-2 shadow-md dark:bg-gray-900"
    />
  )
}
