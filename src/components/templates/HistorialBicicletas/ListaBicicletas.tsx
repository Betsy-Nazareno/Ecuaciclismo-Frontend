import * as React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import tw from 'twrnc'
import { RootState } from '../../../redux/store'
import TarjetaBicicleta from './TarjetaBicicleta'
import { recuperarBicicletas } from '../../../lib/services/bicicleta.services'
import { Bicicleta } from '../../../models/Bicicletas'
import EmptyTarjetaPublicacion from '../../organismos/EmptyTarjetaPublicacion'
import WithoutResults from '../../moleculas/WithoutResults'

const ListaBicicletas = () => {
    const { authToken } = useSelector((state: RootState) => state.user)
    const [listBicicletas, setListBicicletas] = React.useState<Bicicleta[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const { bicicletaHasModified } = useSelector(
        (state: RootState) => state.bicicleta
    )
    React.useEffect(() => {
        ; (async () => {
            const listRBicicletas = await recuperarBicicletas(authToken || '')
            if (listRBicicletas.length > 0) {
                setListBicicletas(listRBicicletas)
            } else {
                setListBicicletas([])
            }
            setIsLoading(false)
        })()
    }, [bicicletaHasModified])

    return (
        <View style={tw`pt-4`}>
            {isLoading ? (
                <>
                    <EmptyTarjetaPublicacion />
                    <EmptyTarjetaPublicacion />
                    <EmptyTarjetaPublicacion />
                </>
            ) : listBicicletas.length <= 0 ? (
                <WithoutResults styles="pt-12" />
            ) : (
                listBicicletas.map((bici, index) => (
                    <View key={index} style={tw`p-2`}>
                        <TarjetaBicicleta bicicleta={bici} />
                    </View>
                ))
            )}

        </View>
    )
}

export default ListaBicicletas
