import * as React from 'react'
import tw from 'twrnc'
import { ScrollView, Text } from 'react-native'
import HeaderScreen from '../../moleculas/HeaderScreen'
import { Formik } from 'formik'
import { RutasValidationSchema } from '../../../schemas/RutasValidationSchema'
import FieldFormulario from '../../moleculas/FieldFormulario'
import Input from '../../moleculas/Input'
import { BACKGROUND_COLORS, TEXT_COLORS } from '../../../utils/constants'
import SelectCreatableList from '../../moleculas/SelectCreatableList'
import GalleryMultiImages from '../../organismos/GalleryMultiImages'
import FieldFechaHora from '../../moleculas/FieldFechaHora'
import MapViewSelectUbication from '../../moleculas/MapViewSelectUbication'
import Spinner from '../../atomos/Spinner'
import SecondaryButton from '../../atomos/SecondaryButton'
import SelectCreatableBatches from '../../moleculas/SelectCreatableBatches'
import {
  getColaboracionesRutas,
  getRequisitos,
  getTiposRuta,
  guardarRuta,
} from '../../../lib/services/rutas.services'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { Ruta } from '../../../models/Rutas'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList, Screens } from '../../../models/Screens.types'
import { getAdminTokens } from '../../../lib/services/notifications.services'
import { usePermissionsNotifications } from '../../../hooks/usePermissionsNotifications'
import { capitalize } from '../../../utils/capitalizeText'

const FormularioRutas = () => {
  const { authToken, user } = useSelector((state: RootState) => state.user)
  const [isLoading, setIsLoading] = React.useState(false)
  const [requisitosCatalog, setRequisitosCatalog] = React.useState([])
  const [tiposRutaCatalog, setTiposRutaCatalog] = React.useState([])
  const [colaboracionesCatalog, setColaboracionesCatalog] = React.useState([])
  const { sendPushNotification } = usePermissionsNotifications()
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, Screens>>()
  const initialValues = {
    nombre: '',
    cupos_disponibles: undefined,
    requisitos: [],
    tipoRuta: [],
    fotos: [],
    lugar: '',
    ubicacion: {
      coordinateX: {
        latitude: -2.1538019492930163,
        longitude: -79.88844282925129,
      },
      coordinateY: {
        latitude: -2.1453200715782175,
        longitude: -79.89056378602983,
      },
    },
    fecha_inicio: undefined,
    fecha_fin: undefined,
    descripcion: '',
    colaboraciones: [],
  }

  React.useEffect(() => {
    ;(async function () {
      if (authToken) {
        setRequisitosCatalog(await getRequisitos(authToken))
        setTiposRutaCatalog(await getTiposRuta(authToken))
        setColaboracionesCatalog(await getColaboracionesRutas(authToken))
      }
    })()
  }, [])

  const sendNotificationToAdmins = async () => {
    if (!authToken) return
    const tokens = await getAdminTokens(authToken)
    await sendPushNotification({
      tokens,
      title: 'Nueva ruta propuesta',
      body: `${capitalize(user?.first_name)} ${capitalize(
        user?.last_name
      )} ha sugerido una ruta para la comunidad y necesita aprobación`,
    })
  }

  const handleSubmit = async (prop: Ruta) => {
    setIsLoading(true)
    if (authToken) {
      await guardarRuta(authToken, prop)
      if (!user?.admin) {
        await sendNotificationToAdmins()
      }
    }
    setIsLoading(false)
    navigation.navigate('Rutas')
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={tw`px-2 mb-8`}>
      <HeaderScreen
        title="Rutas"
        message="¡Planifica actividades para la comunidad!"
        srcImage={require('../../../../assets/ruta_icon.png')}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={RutasValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            <FieldFormulario>
              <Input
                text="Nombre"
                type="none"
                name="nombre"
                placeholder="Nombre de la ruta..."
                value={values.nombre}
                setValue={(value) => setFieldValue('nombre', value)}
              />
            </FieldFormulario>

            <FieldFormulario>
              <Input
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                text="Descripcion"
                type="none"
                name="descripcion"
                placeholder="Agrega una descripción del evento..."
                value={values.descripcion}
                setValue={(value) => setFieldValue('descripcion', value)}
              />
            </FieldFormulario>

            <FieldFormulario>
              <Text style={tw`${TEXT_COLORS.DARK_BLUE} font-bold text-sm pl-2`}>
                Tipo de Ruta
              </Text>
              <SelectCreatableBatches
                values={tiposRutaCatalog}
                selectedValues={values.tipoRuta}
                setValuesSelected={(tipo) => {
                  const exists = values.tipoRuta.find(
                    (type: any) => type === tipo
                  )
                  if (!exists) {
                    setFieldValue('tipoRuta', [
                      ...(values.tipoRuta || []),
                      tipo,
                    ])
                  }
                }}
                deleteValue={(tipo) => {
                  setFieldValue('tipoRuta', [
                    ...(values.tipoRuta || []).filter((m: any) => m !== tipo),
                  ])
                }}
                placeholder="Montaña, Carretera..."
                field={'tiposRuta'}
              />
            </FieldFormulario>

            <FieldFormulario>
              <Text
                style={tw`${TEXT_COLORS.DARK_BLUE} font-bold text-sm pl-2 pb-4`}
              >
                Requisitos
              </Text>
              <SelectCreatableList
                field="requisitos"
                placeholder="Insumos, Nivel de ciclista..."
                values={requisitosCatalog}
                selectedValues={values.requisitos}
                setValuesSelected={(valor) => {
                  const exists = values.requisitos.find(
                    (requisito) => requisito === valor
                  )
                  if (!exists) {
                    setFieldValue('requisitos', [
                      ...(values.requisitos || []),
                      valor,
                    ])
                  }
                }}
                deleteValue={(valor) => {
                  setFieldValue('requisitos', [
                    ...(values.requisitos || []).filter((m) => m !== valor),
                  ])
                }}
              />
            </FieldFormulario>

            <FieldFormulario>
              <Text
                style={tw`${TEXT_COLORS.DARK_BLUE} font-bold text-sm pl-2 pb-4`}
              >
                Colaboraciones de los ciclistas
              </Text>
              <SelectCreatableList
                field="colaboraciones"
                placeholder="Gasas, Alcohol..."
                values={colaboracionesCatalog}
                selectedValues={values.colaboraciones}
                setValuesSelected={(valor) => {
                  const exists = values.colaboraciones.find(
                    (colaboracion) => colaboracion === valor
                  )
                  if (!exists) {
                    setFieldValue('colaboraciones', [
                      ...(values.colaboraciones || []),
                      valor,
                    ])
                  }
                }}
                deleteValue={(valor) => {
                  setFieldValue('colaboraciones', [
                    ...(values.colaboraciones || []).filter((m) => m !== valor),
                  ])
                }}
              />
            </FieldFormulario>

            <FieldFormulario>
              <Input
                text="Cupos disponibles"
                type="none"
                name="cupos"
                placeholder="Cantidad de participantes admitidos..."
                value={values.cupos_disponibles}
                setValue={(value) => setFieldValue('cupos_disponibles', value)}
              />
            </FieldFormulario>

            <FieldFormulario>
              <Text style={tw`${TEXT_COLORS.DARK_BLUE} font-bold text-sm pl-2`}>
                Fotos
              </Text>
              <GalleryMultiImages
                field="fotos"
                setFieldValue={setFieldValue}
                values={values.fotos}
                allowedFiles={['image/*']}
                icon={require('../../../../assets/ruta_gallery.png')}
                placeholder="¡Agrega algunas imágenes de la ruta!"
              />
            </FieldFormulario>

            <FieldFormulario>
              <Input
                text="Lugar"
                type="none"
                name="lugar"
                placeholder="Añade una referencia del punto de partida..."
                value={values.lugar}
                setValue={(value) => setFieldValue('lugar', value)}
              />
            </FieldFormulario>

            <FieldFormulario>
              <Text style={tw`${TEXT_COLORS.DARK_BLUE} font-bold text-sm pl-2`}>
                Fecha de inicio
              </Text>
              <FieldFechaHora
                fecha={values.fecha_inicio}
                setFecha={(value) => setFieldValue('fecha_inicio', value)}
              />
            </FieldFormulario>

            <FieldFormulario>
              <Text style={tw`${TEXT_COLORS.DARK_BLUE} font-bold text-sm pl-2`}>
                Fecha de finalización
              </Text>
              <FieldFechaHora
                fecha={values.fecha_fin}
                setFecha={(value) => setFieldValue('fecha_fin', value)}
              />
            </FieldFormulario>

            <FieldFormulario>
              <Text style={tw`${TEXT_COLORS.DARK_BLUE} font-bold text-sm pl-2`}>
                Ubicacion
              </Text>
              <MapViewSelectUbication
                select
                field="ubicacion"
                setField={setFieldValue}
                value={values.ubicacion}
              />
            </FieldFormulario>

            {isLoading ? (
              <Spinner />
            ) : (
              <SecondaryButton
                label={user?.admin ? 'Publicar' : 'Proponer'}
                handleClick={handleSubmit}
                style={`${BACKGROUND_COLORS.PRIMARY_BLUE} w-6/12 mx-auto mt-6`}
              />
            )}
          </>
        )}
      </Formik>
    </ScrollView>
  )
}

export default FormularioRutas