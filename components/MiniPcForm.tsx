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
      displayPort: 0,
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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-md border bg-gray-800 p-4 text-white"
    >
      <h2 className="text-lg font-bold">Información General</h2>
      <input
        className="input-style"
        type="text"
        name="id"
        placeholder="ID"
        value={formData.id}
        onChange={handleChange}
        required
      />
      <input
        className="input-style"
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <input
        className="input-style"
        type="text"
        name="brand"
        placeholder="Brand"
        value={formData.brand}
        onChange={handleChange}
        required
      />
      <input
        className="input-style"
        type="text"
        name="model"
        placeholder="Model"
        value={formData.model}
        onChange={handleChange}
        required
      />
      <textarea
        className="input-style"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        className="input-style"
        type="url"
        name="imgSrc"
        placeholder="Main Image URL"
        value={formData.imgSrc}
        onChange={handleChange}
      />

      <h2 className="text-lg font-bold">CPU</h2>
      <input
        className="input-style"
        type="text"
        name="cpu.brand"
        placeholder="CPU Brand"
        value={formData.cpu.brand}
        onChange={handleChange}
        required
      />
      <input
        className="input-style"
        type="text"
        name="cpu.model"
        placeholder="CPU Model"
        value={formData.cpu.model}
        onChange={handleChange}
        required
      />
      <input
        className="input-style"
        type="number"
        name="cpu.cores"
        placeholder="Cores"
        value={formData.cpu.cores}
        onChange={handleChange}
        required
      />
      <input
        className="input-style"
        type="number"
        name="cpu.threads"
        placeholder="Threads"
        value={formData.cpu.threads}
        onChange={handleChange}
        required
      />
      <input
        className="input-style"
        type="number"
        name="cpu.baseClockGHz"
        placeholder="Base Clock GHz"
        value={formData.cpu.baseClockGHz || ''}
        onChange={handleChange}
      />
      <input
        className="input-style"
        type="number"
        name="cpu.boostClockGHz"
        placeholder="Boost Clock GHz"
        value={formData.cpu.boostClockGHz || ''}
        onChange={handleChange}
      />
      <input
        className="input-style"
        type="text"
        name="cpu.cache.type"
        placeholder="Cache Type"
        value={formData.cpu.cache?.type || ''}
        onChange={handleChange}
      />
      <input
        className="input-style"
        type="number"
        name="cpu.cache.capacityMB"
        placeholder="Cache Capacity MB"
        value={formData.cpu.cache?.capacityMB || ''}
        onChange={handleChange}
      />

      <h2 className="text-lg font-bold">RAM & Storage Variants</h2>
      {formData.variants.map((variant, index) => (
        <div key={index} className="space-y-2 rounded-md border p-2">
          <input
            className="input-style"
            type="number"
            name={`variants[${index}].ram.capacityGB`}
            placeholder="RAM Capacity GB"
            value={variant.ram.capacityGB}
            onChange={handleChange}
          />
          <input
            className="input-style"
            type="text"
            name={`variants[${index}].ram.type`}
            placeholder="RAM Type"
            value={variant.ram.type}
            onChange={handleChange}
          />
          <input
            className="input-style"
            type="text"
            name={`variants[${index}].storage.type`}
            placeholder="Storage Type"
            value={variant.storage.type}
            onChange={handleChange}
          />
          <input
            className="input-style"
            type="number"
            name={`variants[${index}].storage.capacityGB`}
            placeholder="Storage Capacity GB"
            value={variant.storage.capacityGB}
            onChange={handleChange}
          />
        </div>
      ))}

      <h2 className="text-lg font-bold">Graphics</h2>
      <label className="flex items-center">
        <input
          type="checkbox"
          name="graphics.integrated"
          checked={formData.graphics.integrated}
          onChange={handleChange}
        />
        <span className="ml-2">Integrated Graphics</span>
      </label>
      <input
        className="input-style"
        type="text"
        name="graphics.brand"
        placeholder="Graphics Brand"
        value={formData.graphics.brand || ''}
        onChange={handleChange}
      />
      <input
        className="input-style"
        type="text"
        name="graphics.model"
        placeholder="Graphics Model"
        value={formData.graphics.model || ''}
        onChange={handleChange}
      />
      <input
        className="input-style"
        type="number"
        name="graphics.frequencyMHz"
        placeholder="Frequency MHz"
        value={formData.graphics.frequencyMHz || ''}
        onChange={handleChange}
      />

      <h2 className="text-lg font-bold">Connectivity</h2>
      <input
        className="input-style"
        type="text"
        name="connectivity.wifi"
        placeholder="Wi-Fi Version"
        value={formData.connectivity.wifi}
        onChange={handleChange}
        required
      />
      <input
        className="input-style"
        type="text"
        name="connectivity.bluetooth"
        placeholder="Bluetooth Version"
        value={formData.connectivity.bluetooth}
        onChange={handleChange}
        required
      />

      <h2 className="text-lg font-bold">Ports</h2>
      <input
        className="input-style"
        type="number"
        name="ports.usb4"
        placeholder="USB 4 Ports"
        value={formData.ports.usb4 || ''}
        onChange={handleChange}
      />
      <input
        className="input-style"
        type="number"
        name="ports.usb3"
        placeholder="USB 3 Ports"
        value={formData.ports.usb3 || ''}
        onChange={handleChange}
      />
      <input
        className="input-style"
        type="number"
        name="ports.usb2"
        placeholder="USB 2 Ports"
        value={formData.ports.usb2 || ''}
        onChange={handleChange}
      />
      <input
        className="input-style"
        type="number"
        name="ports.displayPort"
        placeholder="DisplayPort"
        value={formData.ports.displayPort || ''}
        onChange={handleChange}
      />
      <input
        className="input-style"
        type="number"
        name="ports.ethernet"
        placeholder="Ethernet Ports"
        value={formData.ports.ethernet || ''}
        onChange={handleChange}
      />
      <label className="flex items-center">
        <input
          type="checkbox"
          name="ports.audioJack"
          checked={formData.ports.audioJack}
          onChange={handleChange}
        />
        <span className="ml-2">Audio Jack</span>
      </label>
      <label className="flex items-center">
        <input
          type="checkbox"
          name="ports.sdCardReader"
          checked={formData.ports.sdCardReader}
          onChange={handleChange}
        />
        <span className="ml-2">SD Card Reader</span>
      </label>

      <h2 className="text-lg font-bold">Dimensions</h2>
      <input
        className="input-style"
        type="number"
        name="dimensions.widthMm"
        placeholder="Width (mm)"
        value={formData.dimensions.widthMm || ''}
        onChange={handleChange}
      />
      <input
        className="input-style"
        type="number"
        name="dimensions.heightMm"
        placeholder="Height (mm)"
        value={formData.dimensions.heightMm || ''}
        onChange={handleChange}
      />
      <input
        className="input-style"
        type="number"
        name="dimensions.depthMm"
        placeholder="Depth (mm)"
        value={formData.dimensions.depthMm || ''}
        onChange={handleChange}
      />

      <h2 className="text-lg font-bold">Miscellaneous</h2>
      <input
        className="input-style"
        type="number"
        name="weightKg"
        placeholder="Weight (kg)"
        value={formData.weightKg}
        onChange={handleChange}
        required
      />
      <input
        className="input-style"
        type="number"
        name="powerConsumptionW"
        placeholder="Power Consumption (W)"
        value={formData.powerConsumptionW || ''}
        onChange={handleChange}
      />
      <input
        className="input-style"
        type="number"
        name="releaseYear"
        placeholder="Release Year"
        value={formData.releaseYear || ''}
        onChange={handleChange}
      />

      <button type="submit" className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700">
        Generate ZIP
      </button>
    </form>
  )
}

export default MiniPcForm
