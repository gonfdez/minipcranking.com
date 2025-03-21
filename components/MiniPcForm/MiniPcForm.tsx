'use client'
import Form from '@rjsf/core'
import { IChangeEvent } from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { miniPcSchema } from '../../app/minipcs/form/schema'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import './style.css'

const ArrayFieldTemplate = ({ items, canAdd, onAddClick, schema }) => {
  const title = schema.title || 'Elemento'

  return (
    <div className="w-full space-y-4">
      <h2 className="form-title">{title}s</h2>
      {items.map((element) => (
        <div key={element.index} className="rounded-md border p-4">
          {element.children}
          <button
            type="button"
            className="mt-2 rounded bg-red-800 px-3 py-1 text-white hover:bg-red-900"
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
          className="rounded bg-green-800 px-3 py-1 text-white hover:bg-green-900"
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
  return `${brand} ${model}` // Mantiene mayúsculas
}

const handleChange = ({ formData, errors }: IChangeEvent) => {
  if (formData.brand && formData.model) {
    formData.id = generateId(formData.brand, formData.model)
    formData.title = generateTitle(formData.brand, formData.model)
  }
}

const fetchAsBlob = async (url: string): Promise<Blob> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`No se pudo descargar la imagen de ${url}`)
  return await response.blob()
}

const convertToWebP = async (blob: Blob): Promise<Blob> => {
  const imageBitmap = await createImageBitmap(blob)
  const canvas = document.createElement('canvas')
  canvas.width = imageBitmap.width
  canvas.height = imageBitmap.height
  const ctx = canvas.getContext('2d')
  ctx?.drawImage(imageBitmap, 0, 0)
  return new Promise((resolve) => {
    canvas.toBlob((webpBlob) => {
      resolve(webpBlob!)
    }, 'image/webp')
  })
}

const onSubmit = async ({ formData }: IChangeEvent) => {
  try {
    if (!formData || !formData.id) throw new Error('Información incompleta para generar el ZIP.')
    const id = formData.id
    const zip = new JSZip()

    // 1. Agrega el JSON
    const jsonBlob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' })
    zip.file(`${id}.json`, jsonBlob)

    // 2. Descarga y convierte la imagen principal
    if (formData.imgSrc) {
      const imgBlob = await fetchAsBlob(formData.imgSrc)
      const webpBlob = await convertToWebP(imgBlob)
      zip.file(`${id}.webp`, webpBlob)
    }

    // 3. Descarga y convierte la imagen de puertos
    if (formData.ports?.imageSrc) {
      const portsBlob = await fetchAsBlob(formData.ports.imageSrc)
      const portsWebp = await convertToWebP(portsBlob)
      zip.file(`${id}Ports.webp`, portsWebp)
    }

    // 4. Genera el ZIP y descárgalo
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, `${id}.zip`)
    console.log('ZIP generado y descargado.')
  } catch (error) {
    console.error('Error generando el ZIP:', error)
    alert('Hubo un problema generando el archivo ZIP. Revisa la consola para más detalles.')
  }
}

export default function MiniPcForm() {
  return (
    <Form
      schema={miniPcSchema}
      uiSchema={uiSchema}
      validator={validator}
      onChange={handleChange}
      onSubmit={onSubmit}
      className="rounded-lg bg-white p-2 shadow-md dark:bg-gray-900"
    />
  )
}
