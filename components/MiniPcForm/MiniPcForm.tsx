'use client'
import Form from '@rjsf/core'
import { IChangeEvent } from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { miniPcSchema } from '../../app/minipcs/form/schema'

import './style.css'

const ArrayFieldTemplate = ({ items, canAdd, onAddClick }) => (
  <div className="w-full space-y-4">
    <h2 className="form-title">Variantes</h2>
    {items.map((element) => (
      <div key={element.index} className="rounded-md border bg-gray-100 p-4 dark:bg-gray-800">
        {element.children}
        <button
          type="button"
          className="mt-2 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
          onClick={element.onDropIndexClick(element.index)}
        >
          Eliminar
        </button>
      </div>
    ))}
    {canAdd && (
      <button
        type="button"
        className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
        onClick={onAddClick}
      >
        Agregar Variante
      </button>
    )}
  </div>
)

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
  },
}

export default function MiniPcForm() {
  const onSubmit = (data: IChangeEvent) => {
    console.log('Mini PC Registrado:', data.formData)
  }

  return (
    <Form
      schema={miniPcSchema}
      uiSchema={uiSchema}
      validator={validator}
      onSubmit={onSubmit}
      className="rounded-lg bg-white p-2 shadow-md dark:bg-gray-900"
    />
  )
}
