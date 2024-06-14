

const Modal = ({data}) => {
    return(
        <Modal visible={showDeleteConfirmation} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
            <Text>ID: {data.id}</Text>
            <Text>Nombre: {data.fullName}</Text>
            {/* Otros campos de información del usuario */}

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity onPress={handleDeleteConfirmed} style={[styles.modalButton, styles.deleteButton]}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelDelete} style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
};

export default Modal;