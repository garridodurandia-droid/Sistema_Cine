
function empty(array) {
  const datos = Object.values(array)
  for (let i = 0; i < datos.length; i++) {
    const valor = datos[i] !== null && datos[i] !== undefined ? String(datos[i]) : "";
    if (valor.trim() === "") {
      return false
    }
  }
  return true;
}

function incompletos(array, fields) {
  const data = []
  for (let i = 0; i < array.length; i++) {
    if (array[i] != null && array[i] != undefined) {
      data.push(array[i])
    }
  }
  if (data.length != fields.length) {
    return false;
  }
  return true;

}

module.exports = { empty, incompletos, }