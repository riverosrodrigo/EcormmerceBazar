window.onload = function () {
  //animaciones
$("body").prepend('<img id="logo" src="multimedia/logo.png" alt="">');
$("#logo").hide();
$("#logo").animate({  left:'200px',
                        height:'toggle',
                        width:'300px'  }, 
                        "slow",             
                    );

  // Variables
  let carrito = [];
  let total = 0;
  const botonComprar = document.getElementById('boton-comprar');
  botonComprar.addEventListener('click', mensaje);
  const DOMitems = document.querySelector('#items');
  const DOMcarrito = document.querySelector('#carrito');
  const DOMtotal = document.querySelector('#total');
  const DOMbotonVaciar = document.querySelector('#boton-vaciar');
  const miLocalStorage = window.localStorage;
  let datos =[];

  //ajax
  $.ajax({
      url: 'datos.json',
      method: 'GET',
      dataType: 'json',
      success: function(data, status, jqXHR){
          datos=data;
          renderizarProductos(datos);
          guardarCarritoEnLocalStorage();
          cargarCarritoDeLocalStorage();
       },
      error: function(jqXHR, status, data){
          console.log(data);
          console.log(status);
           console.log(jqXHR);
           }
        })
// Funciones
// Cards de productos
  
  function renderizarProductos() {
      datos.forEach((info) => {
          // Estructura
          const miNodo = document.createElement('div');
          miNodo.classList.add('card', 'col-sm-4');
          // Body
          const miNodoCardBody = document.createElement('div');
          miNodoCardBody.classList.add('card-body');
          // Titulo
          const miNodoTitle = document.createElement('h5');
          miNodoTitle.classList.add('card-title');
          miNodoTitle.textContent = info.nombre;
          // Imagen
          const miNodoImagen = document.createElement('img');
          miNodoImagen.classList.add('img-fluid');
          miNodoImagen.setAttribute('src', info.imagen);
          // Precio
          const miNodoPrecio = document.createElement('p');
          miNodoPrecio.classList.add('card-text');
          miNodoPrecio.textContent = '$' + info.precio;
          // Boton 
          const miNodoBoton = document.createElement('button');
          miNodoBoton.classList.add('btn', 'btn-primary');
          miNodoBoton.textContent = '+';
          miNodoBoton.setAttribute('marcador', info.id);
          miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
          // Inserto
          miNodoCardBody.appendChild(miNodoImagen);
          miNodoCardBody.appendChild(miNodoTitle);
          miNodoCardBody.appendChild(miNodoPrecio);
          miNodoCardBody.appendChild(miNodoBoton);
          miNodo.appendChild(miNodoCardBody);
          DOMitems.appendChild(miNodo);
      });
  }

 //añado el producto al carrito

  function anyadirProductoAlCarrito(evento) {
      // Añado el Nodo alcarrito
      carrito.push(evento.target.getAttribute('marcador'))
      // Calculo el total
      calcularTotal();
      // Actualizo el carrito 
      renderizarCarrito();
      // Actualizo el LocalStorage
      guardarCarritoEnLocalStorage();
  }

  //cargo los productos en el carrito

  function renderizarCarrito() {
      // Vacia todo el html
      DOMcarrito.textContent = '';
      // Quita los duplicados
      const carritoSinDuplicados = [...new Set(carrito)];
      // Genera los Nodos a partir de carrito
      carritoSinDuplicados.forEach((item) => {
          // Obtenemos el item que necesitamos de la variable base de datos
          const miItem = datos.filter((itemBaseDatos) => {
              // ¿Coincide las id? Solo puede existir un caso
              return itemBaseDatos.id === parseInt(item);
          });
          // Cuenta el número de veces que se repite el producto
          const numeroUnidadesItem = carrito.reduce((total, itemId) => {
              // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
              return itemId === item ? total += 1 : total;
          }, 0);
          // Creo el nodo del item del carrito
          const miNodo = document.createElement('li');
          miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
          miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - $${miItem[0].precio}`;
          // Boton de borrar
          const miBoton = document.createElement('button');
          miBoton.classList.add('btn', 'btn-danger', 'mx-5');
          miBoton.textContent = 'X';
          miBoton.style.marginLeft = '1rem';
          miBoton.dataset.item = item;
          miBoton.addEventListener('click', borrarItemCarrito);
          // Mezclamos nodos
          miNodo.appendChild(miBoton);
          DOMcarrito.appendChild(miNodo);
      });
  }
//borra elementos del carrito

  function borrarItemCarrito(evento) {
      // Obtenemos el producto ID que hay en el boton pulsado
      const id = evento.target.dataset.item;
      // Borra todos los productos
      carrito = carrito.filter((carritoId) => {
          return carritoId !== id;
      });
      // volvemos a renderizar
      renderizarCarrito();
      // Calculamos de nuevo el precio
      calcularTotal();
      // Actualizamos el LocalStorage
      guardarCarritoEnLocalStorage();

  }

 //calcula el precio

  function calcularTotal() {
      // Limpia precio anterior
      total = 0;
      // Recorre el array del carrito
      carrito.forEach((item) => {
          // De cada elemento obtenemos su precio
          const miItem = datos.filter((itemBaseDatos) => {
              return itemBaseDatos.id === parseInt(item);
          });
          total = total + miItem[0].precio;
      });
      // Renderiza el precio en el HTML
      DOMtotal.textContent = total.toFixed(2);
  }

 //vacia el carrito
  function vaciarCarrito() {
      // Limpia los productos guardados
      carrito = [];
      // Renderiza los cambios
      renderizarCarrito();
      calcularTotal();
      // Borra LocalStorage
      localStorage.clear();

  }
// guarda los datos en el local
  function guardarCarritoEnLocalStorage () {
      miLocalStorage.setItem('carrito', JSON.stringify(carrito));
  }
//carga el carrito desde el local
  function cargarCarritoDeLocalStorage () {
      // ¿Existe un carrito previo guardado en LocalStorage?
      if (miLocalStorage.getItem('carrito') !== null) {
          // Carga la información
          carrito = JSON.parse(miLocalStorage.getItem('carrito'));
      }
  }

  // Eventos
  DOMbotonVaciar.addEventListener('click', vaciarCarrito);
  
  function mensaje (){

      Swal.fire('Gracias por la compra !!');

  }

 
}
