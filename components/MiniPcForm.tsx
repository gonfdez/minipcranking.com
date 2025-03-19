'use client'

import { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

function MiniPcForm() {
  const [formData, setFormData] = useState<MiniPcInterface>({
    id: '',
    title: '',
    brand: '',
    model: '',
    description: '',
    href: '',
    imgSrc: '',
    cpu: {
      brand: '',
      model: '',
      cores: 0,
      threads: 0,
      baseClockGHz: 0,
      boostClockGHz: 0,
      cache: { type: '', capacityMB: 0 },
    },
    variants: [
      {
        ram: { capacityGB: 0, type: '' },
        storage: { type: '', capacityGB: 0 },
        oferts: [{ provider: '', url: '', priceUsd: 0, warrantyYears: 0 }],
      },
    ],
    maxRAMCapacityGB: 0,
    maxStorageCapacityGB: 0,
    graphics: {
      integrated: true,
      brand: '',
      model: '',
      frequencyMHz: 0,
      maxTOPS: 0,
      graphicCoresCU: 0,
      displayPorts: {
        thunderbolt: { amount: 0, type: '' },
        dp: { amount: 0, type: '' },
        hdmi: { amount: 0, type: '' },
        usb4: { amount: 0, type: '' },
      },
    },
    builtinMicrophone: false,
    builtinSpeakers: false,
    supportExternalDiscreteGraphicsCard: false,
    ports: {
      usb4: 0,
      usb3: 0,
      usb2: 0,
      usbC: 0,
      ethernet: 0,
      audioJack: false,
      sdCardReader: false,
    },
    connectivity: { wifi: '', bluetooth: '' },
    dimensions: { widthMm: 0, heightMm: 0, depthMm: 0, volumeL: 0 },
    weightKg: 0,
    powerConsumptionW: 0,
    releaseYear: 0,
  })

  const handleNestedChange = (
    path: string,
    value: string | boolean | number,
    prevData: MiniPcInterface
  ) => {
    const keys = path.split('.')
    const newData = { ...prevData }
    let temp = newData

    for (let i = 0; i < keys.length - 1; i++) {
      temp[keys[i]] = temp[keys[i]] ?? {} // Asegurar que existe el nivel intermedio
      temp = temp[keys[i]]
    }

    temp[keys[keys.length - 1]] = value
    return newData
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => handleNestedChange(name, type === 'checkbox' ? checked : value, prev))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const zip = new JSZip()
    const folder = zip.folder(formData.id)
    if (!folder) throw new Error('No folder object')
    folder.file('data.json', JSON.stringify(formData, null, 2))

    if (formData.imgSrc) {
      folder.file(`images/${formData.id}.webp`, formData.imgSrc)
    }
    if (formData.ports?.imageSrc) {
      folder.file(`images/${formData.id}Ports.webp`, formData.ports.imageSrc)
    }

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `${formData.id}.zip`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-md bg-gray-800 p-4 text-white">
      <h1 className="border-b pb-2 text-lg font-bold">Información General</h1>
      {[
        { name: 'id', label: 'ID', required: true },
        { name: 'title', label: 'Title', required: true },
        { name: 'brand', label: 'Brand', required: true },
        { name: 'model', label: 'Model', required: true },
        { name: 'description', label: 'Description', required: true, type: 'textarea' },
        { name: 'imgSrc', label: 'Main Image URL', type: 'url' },
        { name: 'href', label: 'Product URL', type: 'url' },
      ].map(({ name, label, required, type = 'text' }) => (
        <div key={name} className="flex items-center space-x-2">
          <label className="w-1/4 font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {type === 'textarea' ? (
            <textarea
              className="input-style w-3/4"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required={required}
            />
          ) : (
            <input
              className="input-style w-3/4"
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required={required}
            />
          )}
        </div>
      ))}

      {/* <h1 className="border-b pb-2 text-lg font-bold">Variants</h1>
      {['ram.capacityGB', 'ram.type', 'storage.type', 'storage.capacityGB'].map((field) => (
        <div key={field} className="flex items-center space-x-2">
          <label className="w-1/4 font-medium">{field.split('.').join(' ')}</label>
          <input
            className="input-style w-3/4"
            type={field.includes('capacityGB') ? 'number' : 'text'}
            name={field}
            value={formData[field] || ''}
            onChange={handleChange}
          />
        </div>
      ))}

      <h1 className="border-b pb-2 text-lg font-bold">Oferts</h1>
      {['oferts.provider', 'oferts.url', 'oferts.priceUsd', 'oferts.warrantyYears'].map((field) => (
        <div key={field} className="flex items-center space-x-2">
          <label className="w-1/4 font-medium">{field.split('.').join(' ')}</label>
          <input
            className="input-style w-3/4"
            type={field.includes('priceUsd') || field.includes('warrantyYears') ? 'number' : 'text'}
            name={field}
            value={formData[field] || ''}
            onChange={handleChange}
          />
        </div>
      ))} */}

      <h1 className="border-b pb-2 text-lg font-bold">Graphics</h1>
      {['graphics.integrated', 'graphics.brand', 'graphics.model', 'graphics.frequencyMHz'].map(
        (field) => (
          <div key={field} className="flex items-center space-x-2">
            <label className="w-1/4 font-medium">{field.split('.').join(' ')}</label>
            <input
              className="input-style w-3/4"
              type={field === 'graphics.integrated' ? 'checkbox' : 'text'}
              name={field}
              value={formData[field] || ''}
              onChange={handleChange}
            />
          </div>
        )
      )}

      <h1 className="border-b pb-2 text-lg font-bold">Dimensions & Weight</h1>
      {[
        'dimensions.widthMm',
        'dimensions.heightMm',
        'dimensions.depthMm',
        'dimensions.volumeL',
        'weightKg',
      ].map((field) => (
        <div key={field} className="flex items-center space-x-2">
          <label className="w-1/4 font-medium">{field.split('.').join(' ')}</label>
          <input
            className="input-style w-3/4"
            type="number"
            name={field}
            value={formData[field] || ''}
            onChange={handleChange}
          />
        </div>
      ))}

      <h1 className="border-b pb-2 text-lg font-bold">Ports</h1>
      {['usb4', 'usb3', 'usb2', 'usbC', 'ethernet', 'audioJack', 'sdCardReader'].map((field) => (
        <div key={field} className="flex items-center space-x-2">
          <label className="w-1/4 font-medium">{field.split('.').join(' ')}</label>
          <input
            className="input-style w-3/4"
            type={field === 'audioJack' || field === 'sdCardReader' ? 'checkbox' : 'number'}
            name={field}
            value={formData[field] || ''}
            onChange={handleChange}
          />
        </div>
      ))}

      <button type="submit" className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700">
        Generate
      </button>
    </form>
  )
}

export default MiniPcForm
