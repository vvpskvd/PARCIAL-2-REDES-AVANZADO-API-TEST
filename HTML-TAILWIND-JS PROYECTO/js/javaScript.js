const BASE = 'https://todoapitest.juansegaliz.com';

function show(obj){
  try {
    document.getElementById('output').textContent = JSON.stringify(obj, null, 2);
  } catch(e){
    document.getElementById('output').textContent = String(obj);
  }
}

/// get all
async function getAll(){
  show({ info: 'Cargando lista...' });
  try {
    const res = await fetch(`${BASE}/todos`);
    const text = await res.text();
    let payload;
    try { payload = JSON.parse(text); } catch(e) { payload = text; }

    if (!res.ok) {
      show({ status: res.status, body: payload });
      return;
    }

    if (payload && payload.data !== undefined) {
      show(payload.data);
    } else {
      show(payload);
    }
  } catch (err) {
    show({ error: err.message });
  }
}

// get one
async function getTodoById() {
  const id = document.getElementById('get-id').value.trim();

  if (!id) {
    show({ error: 'Escribe un ID Valido para Consultar...' });
    return;
  }

  show({ info: `Consultando id=${id}...` });
  try {
    const res = await fetch(`${BASE}/todos/${id}`);
    const text = await res.text();
    let payload;
    try { payload = JSON.parse(text); } catch(e) { payload = text; }

    if (!res.ok) {
      show({ status: res.status, body: payload });
      return;
    }

    show(payload);
  } catch (err) {
    show({ error: err.message });
  }
}

// create
async function createTodo(){
  show({ info: 'Enviando Nuevo ID...' });
  try {
    const payload = {
      title: document.getElementById('create-title').value || 'Sin título',
      description: document.getElementById('create-desc').value || '',
      isCompleted: document.getElementById('create-completed').value === 'true',
      priority: parseInt(document.getElementById('create-priority').value, 10)
    };

    const res = await fetch(`${BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const resp = await res.json();
    show(resp);

  } catch (err) {
    show({ error: err.message });
  }
}

// update
async function updateTodo(){
  const id = document.getElementById('update-id').value;
  if (!id) return alert("Escribe un ID Valido");

  show({ info: 'Enviando Actualizacion de ID...' });
  try {
    const payload = {
      title: document.getElementById('update-title').value || 'Sin título',
      description: document.getElementById('update-desc').value || '',
      isCompleted: document.getElementById('update-completed').value === 'true',
      priority: parseInt(document.getElementById('update-priority').value, 10)
    };

    const res = await fetch(`${BASE}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const resp = await res.json();
    show(resp);
  } catch (err) {
    show({ error: err.message });
  }
}

// delete
async function deleteTodo() {
  const id = document.getElementById('delete-id').value.trim();

  if (!id) {
    show({ error: 'Escribe un ID valido para eliminar...' });
    return;
  }

  show({ info: `Eliminando id=${id}...` });
  try {
    const res = await fetch(`${BASE}/todos/${id}`, {
      method: 'DELETE'
    });

    const text = await res.text();
    let payload;
    try { payload = JSON.parse(text); } catch(e) { payload = text; }

    if (!res.ok) {
      show({ status: res.status, body: payload });
      return;
    }

    show(payload);
    show('ID borrado');

  } catch (err) {
    show({ error: err.message });
  }
}

const menuButtons = document.querySelectorAll('.menu-item > button');

menuButtons.forEach(button => {
  button.addEventListener('click', () => {
    const menuItem = button.parentElement;
    const content = menuItem.querySelector('.menu-content');

    // cerrar todo el resto
    menuButtons.forEach(btn => {
      const otherItem = btn.parentElement;
      const otherContent = otherItem.querySelector('.menu-content');
      if (otherItem !== menuItem) {
        otherItem.classList.remove('active');
        otherContent.style.maxHeight = "0px";
      }
    });

    // el que esta abierto
    menuItem.classList.toggle('active');
    if(menuItem.classList.contains('active')) {
      content.style.maxHeight = content.scrollHeight + "px";
    } else {
      content.style.maxHeight = "0px";
    }
  });
});

// event listeners
document.getElementById('btn-create').addEventListener('click', createTodo);
document.getElementById('btn-update').addEventListener('click', updateTodo);
document.getElementById('btn-delete').addEventListener('click', deleteTodo);
document.getElementById('bttn-get-all-data').addEventListener('click', getAll);
document.getElementById('btn-get-id').addEventListener('click', getTodoById);

show('Conectado - Presiona Crear, actualizar o eliminar ID');