import * as React from 'react'
import tw from 'twrnc'
import { Image, Modal, Pressable, Text, View } from 'react-native'
import { CustomText } from '../atomos/CustomText'
import { TEXT_COLORS, WIDTH_DIMENSIONS } from '../../utils/constants'

interface SafeHomeModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

const SafeHomeModal = ({ visible, setVisible }: SafeHomeModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => {
        setVisible(!visible)
      }}
    >
      <View style={tw` h-full`}>
        <View style={tw`pt-12 pb-4 w-11/12 mx-auto`}>
          <Pressable
            onPress={() => setVisible(!visible)}
            style={tw`absolute -top-1 right-2`}
          >
            <View style={tw`rounded-full w-12 h-12  flex items-end`}>
              <Text
                style={tw`${TEXT_COLORS.GRAY_PLACEHOLDER} font-bold text-4xl`}
              >
                x
              </Text>
            </View>
          </Pressable>
          <View style={tw``}>
            <CustomText
              style={`${TEXT_COLORS.ORANGE} text-3xl`}
              containerProps={{ textAlign: 'center' }}
            >
              ¡Hola, Lorena!
            </CustomText>
            <CustomText
              style={`${TEXT_COLORS.DARK_BLUE} text-3xl`}
              containerProps={{ textAlign: 'center', padding: 12 }}
            >
              ¿Haz llegado a casa?
            </CustomText>
          </View>
          <View style={tw`mx-auto py-8`}>
            <View style={tw`bg-white rounded-full px-8 shadow-sm`}>
              <Image
                source={require('../../../assets/house.png')}
                style={{ width: WIDTH_DIMENSIONS * 0.5 }}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={tw`w-10/12 mx-auto `}>
            <Text style={tw`${TEXT_COLORS.DARK_BLUE} text-xl`}>
              ¡Los miembros de la comunidad están esperando tu confirmación!
            </Text>
          </View>
          <View style={tw`flex flex-row w-10/12 mx-auto pt-12`}>
            <Pressable
              style={tw`flex flex-row items-center px-8`}
              onPress={() => setVisible(!visible)}
            >
              <Image
                source={require('../../../assets/correct.png')}
                style={{ width: 40, height: 40, marginRight: 8 }}
                resizeMode="contain"
              />
              <Text style={tw`${TEXT_COLORS.DARK_BLUE} text-xl`}>Sí</Text>
            </Pressable>

            <Pressable
              style={tw`flex flex-row items-center px-8`}
              onPress={() => setVisible(!visible)}
            >
              <Image
                source={require('../../../assets/failed.png')}
                style={{ width: 40, height: 40, marginRight: 8 }}
                resizeMode="contain"
              />
              <Text style={tw`${TEXT_COLORS.DARK_BLUE} text-xl`}>No</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default SafeHomeModal