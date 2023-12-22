import axios from "axios";
import { Bicicleta } from "../../models/Bicicletas";
import { MultimediaResult } from '../../models/Publicaciones.model'
import { FOLDERS_STORAGE } from '../../utils/constants'
import { guardarArchivo } from '../googleCloudStorage'
import { ImagePickerResult } from 'expo-image-picker'
import { BASE_URL } from '@env'
import { isImagePickerResult } from "../../utils/ckeckTypes";


export const agregarBicicleta = async (
  bicicleta: Bicicleta,
  token: string,
) => {
  try {
    const { imagen } = bicicleta
    const multimediaPaths = await guardarMultimedia(imagen)
    const data = {
      tipo: bicicleta.tipo,
      marca: bicicleta.marca,
      multimedia: [...multimediaPaths]
    }
    const response = await axios({
      method: 'POST',
      url: `${BASE_URL}/api/biclicleta/crear_bicicleta/`,
      data,
      headers: { Authorization: 'Token ' + token },

    })
    console.log(response)
    return response.data
  } catch (e) {
    console.error(e)
    throw new Error('Error interno del servidor (500)');
  }
}

export const recuperarBicicletas = async (
  token_usuario: string) => {
  const uri = `${BASE_URL}/api/biclicleta/mis_bicicletas/`
  console.log(uri)
  const response = await axios({
    method: 'GET',
    url: uri,
    headers: { Authorization: 'Token ' + token_usuario },
  })
  const { data } = response.data || {}
  return converterBicicletas(data)
}

export const eliminarBicicleta = async (
  token_usuario: string,
  id_bicicleta: string) => {
  const uri = `${BASE_URL}/api/biclicleta/${id_bicicleta}/eliminar_bicicleta/`
  console.log(uri)
  const response = await axios({
    method: 'DELETE',
    url: uri,
    headers: { Authorization: 'Token ' + token_usuario },
  })
  return response.data
}

const converterBicicletas = (bicicletas: Bicicleta[]) => {
  return bicicletas.map((bici) =>
    converterBicicletaObject(bici)
  )
}
const converterBicicletaObject = (bicicleta: Bicicleta) => {
  return {
    ...bicicleta
  }
}

const guardarMultimedia = async (multimedia: ImagePickerResult[]) => {
  const multimediaPaths = []
  for (let i = 0; i < multimedia?.length; i++) {
    const file = multimedia[i]
    const isDocResult = isImagePickerResult(file)
    if (isDocResult && file.cancelled == false) {
      const { uri, type } = file
      const name = uri.split('/').pop() || ''
      const path = await guardarArchivo(
        FOLDERS_STORAGE.BICICLETAS,
        name,
        uri
      )
      multimediaPaths.push({ link: path, path: '' })
    } else {
      const fileResult = file as unknown as MultimediaResult
      if (fileResult.tipo !== 'audio') {
        multimediaPaths.push({
          link: fileResult.link,
          tipo: fileResult.tipo,
          path: '',
        })
      }
    }
  }
  return multimediaPaths
}
