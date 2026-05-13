import { useEffect, useState } from 'react'
import { getPet } from '@/lib/api/pet'

export function usePetName(): string {
  const [petName, setPetName] = useState('寵物')

  useEffect(() => {
    getPet()
      .then(res => { if (res.pet?.pet_name) setPetName(res.pet.pet_name) })
      .catch(() => {})

    const refresh = () =>
      getPet()
        .then(res => { if (res.pet?.pet_name) setPetName(res.pet.pet_name) })
        .catch(() => {})

    window.addEventListener('pet-updated', refresh)
    return () => window.removeEventListener('pet-updated', refresh)
  }, [])

  return petName
}
