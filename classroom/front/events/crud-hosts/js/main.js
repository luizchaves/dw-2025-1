import { hosts } from './data.js';

const hostsList = document.getElementById('hostsList');
const addHostForm = document.getElementById('addHostForm');
const addHostModal = new bootstrap.Modal(document.getElementById('addHostModal'));

function removeHostData(id) {
  const index = hosts.findIndex(host => host.id === id);

  hosts.splice(index, 1);
}

function addHostData(hostData) {
  // Gerar um novo ID único
  const newId = Math.max(...hosts.map(h => h.id)) + 1;

  const newHost = {
    id: newId,
    name: hostData.name,
    ip: hostData.ip,
    description: hostData.description,
    status: hostData.status
  };

  hosts.push(newHost);
  return newHost;
}

function createHostCard(host) {
  const hostCard = `
        <div class="col-md-4 mb-4">
          <div id="host-${host.id}" class="card host-card">
            <div class="card-body">
              <h5 class="card-title">${host.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">IP: ${host.ip}</h6>
              <p class="card-text">${host.description}</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-${host.status ? 'success' : 'danger'}">
                  ${host.status ? 'Online' : 'Offline'}
                </span>
                <button class="btn-remove-card btn btn-sm btn-outline-primary" data-id="${host.id}">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
    `;

  hostsList.insertAdjacentHTML('beforeend', hostCard);

  const removeCardBtn = document.querySelector(`#host-${host.id} .btn-remove-card`);

  removeCardBtn.addEventListener('click', function () {
    // Remove the host from the data array
    removeHostData(host.id);

    // Remove the card from the DOM
    this.closest('.col-md-4').remove();
  });
}

function renderHostCards(hosts) {
  hosts.forEach((host) => {
    createHostCard(host);
  });
}

// Event listener para o formulário de cadastro
addHostForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Validar o formulário
  if (!addHostForm.checkValidity()) {
    e.stopPropagation();
    addHostForm.classList.add('was-validated');
    return;
  }

  // Obter dados do formulário
  const hostData = {
    name: document.getElementById('hostName').value.trim(),
    ip: document.getElementById('hostIp').value.trim(),
    description: document.getElementById('hostDescription').value.trim(),
    status: document.getElementById('hostStatus').checked
  };

  // Verificar se já existe um host com o mesmo nome ou IP
  const existingHost = hosts.find(host =>
    host.name === hostData.name || host.ip === hostData.ip
  );

  if (existingHost) {
    alert('Já existe um host com este nome ou endereço IP!');
    return;
  }

  // Adicionar o novo host
  const newHost = addHostData(hostData);

  // Atualizar a visualização
  createHostCard(newHost);

  // Limpar o formulário e fechar o modal
  addHostForm.reset();
  addHostForm.classList.remove('was-validated');
  addHostModal.hide();

  // Mostrar mensagem de sucesso
  showSuccessMessage(`Host "${newHost.name}" cadastrado com sucesso!`);
});

// Função para mostrar mensagem de sucesso
function showSuccessMessage(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-success alert-dismissible fade show';
  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

  const container = document.querySelector('.container');
  container.insertBefore(alertDiv, container.children[1]);

  // Remover o alerta após 5 segundos
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

renderHostCards(hosts);
