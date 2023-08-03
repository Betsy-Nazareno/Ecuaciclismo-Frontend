import * as React from 'react'
import tw from 'twrnc'
import { View } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { RootStackParamList, Screens } from '../../../models/Screens.types'
import HeaderRoundedContainer from '../../moleculas/HeaderRoundedContainer'
import SectionTitle from '../../moleculas/SectionTitle'
import { RootState } from '../../../redux/store'
import BarraFiltros from '../../organismos/BarraFiltros'
import { setText } from '../../../redux/publicacionBusqueda'
import SearchBar from '../../moleculas/SearchBar'
import { etiquetasAlertas } from '../../../utils/constants'
const AlertasFeedHeader = () => {
  const { text } = useSelector((state: RootState) => state.busqueda)
  const dispatch = useDispatch()
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, Screens>>()

  const handleText = (text: string) => {
    dispatch(setText({ text }))
  }

  return (
    <HeaderRoundedContainer>
      <View style={tw`mx-4`}>
        <SectionTitle
          text="Alertas"
          styleText="text-3xl"
          background={false}
          hasButton
          isRestricted={false}
          buttonIcon={require('../../../../assets/menu_white_icon.png')}
          //handleClickButton={() => navigation.navigate('RutasFormulario')}
        />
      </View>
      <SearchBar text={text} setText={handleText} />
      <BarraFiltros filtros={etiquetasAlertas} />
    </HeaderRoundedContainer>
  )
}

export default AlertasFeedHeader