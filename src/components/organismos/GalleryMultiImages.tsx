import React from 'react'
import { Image, ImageSourcePropType, View } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { TEXT_COLORS } from '../../utils/constants'
import { TouchableHighlight } from 'react-native-gesture-handler'
import tw from 'twrnc'
import { ErrorMessage } from 'formik'
import { FieldError } from '../atomos/FieldError'
import PreviewDocuments from './PreviewDocuments'
import FieldFormulario from '../moleculas/FieldFormulario'
import { CustomText } from '../atomos/CustomText'

interface GalleryMultiImagesProps {
  field: string
  values: DocumentPicker.DocumentResult[]
  allowedFiles: string[]
  icon: ImageSourcePropType
  placeholder: string
  setFieldValue: (field: string, files: DocumentPicker.DocumentResult[]) => void
}
const GalleryMultiImages = ({
  field,
  values,
  allowedFiles,
  icon,
  placeholder,
  setFieldValue,
}: GalleryMultiImagesProps) => {
  const deleteFile = (uri: string) => {
    setFieldValue(field, [
      ...(values || []).filter((file: any) => {
        const uriFile = file.uri || file.link
        return uriFile !== uri
      }),
    ])
  }

  const getFile = async () => {
    const file = await DocumentPicker.getDocumentAsync({
      type: allowedFiles,
    })
    if (file.type !== 'cancel') {
      setFieldValue(field, [...(values || []), file])
    }
  }

  return (
    <>
      <PreviewDocuments values={values} handleDelete={deleteFile} />
      <FieldFormulario>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#E7F5FF"
          onPress={getFile}
        >
          <View style={tw`flex flex-row items-center`}>
            <View style={tw`mx-auto py-2 w-3/12`}>
              <Image
                source={icon}
                style={{ width: 80, height: 80, opacity: 0.5 }}
              />
            </View>
            <View style={tw`mx-auto py-2 w-8/12`}>
              <CustomText
                style={`${TEXT_COLORS.DARK_GRAY} text-xs`}
                containerProps={{ textAlign: 'center' }}
              >
                {placeholder}
              </CustomText>
            </View>
          </View>
        </TouchableHighlight>
        {field && (
          <View style={tw`mx-auto`}>
            <ErrorMessage name={field} render={FieldError} />
          </View>
        )}
      </FieldFormulario>
    </>
  )
}
export default GalleryMultiImages
