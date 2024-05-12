import { StyleSheet, Platform} from 'react-native';

export  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      //marginTop:Platform.OS !== 'web' ? 0: 0,
    },

    tex:{
        fontSize:20
    },


    header: {
        backgroundColor: 'black',
        padding: 20,
        alignItems: 'center',
        width:"100%"
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },

    parrafo: {
        fontSize:Platform.OS !== 'web' ? 10 : 20,
        fontWeight: 'bold',
        color: 'white',
    },

    content: {
        flex: 1,
        width:"100%",
        flexDirection: 'row',
    },
    
    sidebar: {
        backgroundColor: '#e0e0e0',
        width: '30%',
        width:Platform.OS === 'web' ? "20%":"30%",
        padding: 10,
    },

    sidebarLink: {
        marginBottom: 10,
    },

    main: {
        flex: 2,
        padding: 5,
    },
   
  });