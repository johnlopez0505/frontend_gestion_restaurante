export const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// Función de validación para el número de teléfono
export const validarTelefono = (telefono) => {
    return /^[679]\d{8}$/.test(telefono);
}

// Función para formatear el número de teléfono con espacios cada tres dígitos
export const formatearTelefono = (telefono) => {
    return telefono.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
}


// Función de validación para el precio
export const validarPrecio = (precio) => {
    return /^\d+(\.\d{1,2})?$/.test(precio);
}

