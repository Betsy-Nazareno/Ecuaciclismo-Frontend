import * as React from 'react'
import { Text, View, Image, Pressable } from 'react-native'
import tw from 'twrnc'
import { CustomText } from '../../atomos/CustomText'
import TarjetaTemplate from '../../organismos/RoundedWhiteBaseTemplate'
import { TEXT_COLORS } from '../../../utils/constants'
import LinkedBadges from '../../moleculas/LinkedBadges'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList, Screens } from '../../../models/Screens.types'
import { Publicacion } from '../../../models/Publicaciones.model'
import VideoPlayer from 'expo-video-player'
import { ResizeMode } from 'expo-av'

interface TarjetaPublicacionesProps {
  publicacion: Publicacion
}

const TarjetaPublicaciones = ({ publicacion }: TarjetaPublicacionesProps) => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, Screens>>()

  const getImagenPrincipal = () => {
    const { multimediaResult } = publicacion
    const main = multimediaResult?.find((file) => file.tipo === 'image')
    if (!main) return null

    return (
      <Image
        source={{ uri: main?.link }}
        style={{ width: 80, height: 80, borderRadius: 40 / 2 }}
      />
    )
  }

  const getVideoPrincipal = () => {
    const { multimediaResult } = publicacion
    const main = multimediaResult?.find((file) => file.tipo === 'video')
    if (!main) return null

    return (
      <VideoPlayer
        style={{ width: 80, height: 80 }}
        videoProps={{
          source: { uri: main.link },
          resizeMode: 'contain' as ResizeMode,
          isLooping: true,
        }}
      />
    )
  }

  const getImagePlaceholder = () => {
    return (
      <Image
        source={require('../../../../assets/publicacion_default_icon.png')}
        style={{ width: 80, height: 80, borderRadius: 40 / 2 }}
      />
    )
  }

  const portadaPrincipal =
    getImagenPrincipal() || getVideoPrincipal() || getImagePlaceholder()

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('DetallePublicacion', {
          token: publicacion.token || '',
        })
      }
    >
      <TarjetaTemplate shadow={false}>
        <View style={tw`pt-2 pb-4 relative`}>
          <CustomText style={`${TEXT_COLORS.DARK_BLUE}`}>
            {publicacion.titulo}
          </CustomText>
          <View style={tw`py-3 flex flex-row`}>
            <View style={tw`w-3/12`}>{portadaPrincipal}</View>
            <View style={tw`w-10/12 pr-3`}>
              <View style={tw`w-full h-9`}>
                <LinkedBadges etiquetas={publicacion.etiquetasResult || []} />
              </View>
              <View style={tw`pl-6 pr-4 pt-1 w-11/12`}>
                <Text numberOfLines={2}>{publicacion.descripcion}</Text>
              </View>
            </View>
          </View>

          <View style={tw`absolute bottom-0 right-2`}>
            <Text style={tw`${TEXT_COLORS.DARK_GRAY} capitalize text-xs`}>
              {publicacion.first_name} {publicacion.last_name}{' '}
              {publicacion.ultimo_cambio}
            </Text>
          </View>
        </View>
      </TarjetaTemplate>
    </Pressable>
  )
}

export default TarjetaPublicaciones
