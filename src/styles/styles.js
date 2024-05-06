import { StyleSheet, Platform} from 'react-native';

export  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:Platform.OS === 'ios' ? 30 : 0,
      marginTop:Platform.OS === 'android' ? 30 : 0,
    },

    tex:{
        color:"red",
        fontSize:36
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

    content: {
        flex: 1,
        width:"100%",
        flexDirection: 'row',
    },
    
    sidebar: {
        backgroundColor: '#e0e0e0',
        width: '30%',
        width:Platform.OS === 'web' ? "20%":"30%",
        padding: 20,
    },

    sidebarLink: {
        marginBottom: 10,
    },

    main: {
        flex: 2,
        padding: 20,
    },
   
  });