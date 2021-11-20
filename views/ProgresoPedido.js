import React, {Fragment, useContext, useEffect, useState} from 'react';
import { View, StyleSheet } from 'react-native';
import {Container, Text, Button, H1, H3} from 'native-base';
import globalStyles from '../styles/global';
import {useNavigation} from '@react-navigation/native';
import firebase from '../firebase';
import Countdown from 'react-countdown';

import PedidoContext from '../context/pedidos/pedidosContext';

const ProgresoPedido = () => {

    const navigatio = useNavigation();
    
    const {idpedido} = useContext(PedidoContext);

    const [tiempo, guardarTiempo] = useState(0);
    const [completado, guardarCompletado] = useState(false);

    useEffect(() => {
        const obtenerProducto = () => {
            firebase.db.collection('ordenes')
                        .doc(idpedido)
                        .onSnapshot(function(doc) {
                            guardarTiempo(doc.data().tiempoentrega);
                            guardarCompletado(doc.data().completado);
                        })
        }
        obtenerProducto()
    },[]);

    //Muestra el countdown en la pantalla
    const renderer = ({minutes, seconds}) => {

        return (
            <Text style={styles.tiempo}>{minutes}:{seconds}</Text>
        )
    }

    return ( 
        <Container style={globalStyles.contenedor}>
            <View style={[globalStyles.contenido, {marginTop:50}]}>
                { tiempo === 0 && (
                    <Fragment>
                        <Text style={{textAlign:'center'}}>Hemos recibido tu orden...</Text>
                        <Text style={{textAlign:'center'}}>Estamos calculando el tiempo de entrega</Text>
                    </Fragment>
                )}
                { !completado && tiempo > 0 && (
                    <Fragment>
                        <Text style={{textAlign:'center'}}>Su orden estara lista en: </Text>
                        <Text>
                            <Countdown
                                date={Date.now() + tiempo * 60000}
                                renderer={renderer}
                            />
                        </Text>
                    </Fragment>
                )}

                { completado && (
                    <Fragment>
                        <H1 style={styles.textoCompletado}>Orden Lista</H1>
                        <H3 style={styles.textoCompletado}>Por favor, pase a recoger su pedido</H3>
                        <Button style={[globalStyles.boton, {marginTop:100}]} rounded block onPress={()=> navigatio.navigate("NuevaOrden")}>
                            <Text style={globalStyles.botonTexto}>Comenzar Una Orden Nueva</Text>
                        </Button>
                    </Fragment>
                )}
            
            </View>
        </Container>
     );
}

const styles = StyleSheet.create({
    tiempo: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 60,
        marginTop: 30
    },
    textoCompletado: {
        textAlign: 'center',
        textTransform: 'uppercase',
        marginBottom: 20
    }
})
 
export default ProgresoPedido;