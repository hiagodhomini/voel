
function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if (id === 'prontuarios') carregarPacientesSelect('pacienteSelecionado');
    if (id === 'agenda') carregarPacientesSelect('pacienteConsulta');
    if (id === 'pacientes') carregarPacientes();
    if (id === 'relatorios') gerarRelatorio();
    if (id === 'agenda') carregarAgenda();
    if (id === 'prontuarios') carregarProntuarios();
}

function salvarPaciente() {
    const nome = document.getElementById('nomePaciente').value.trim();
    const nascimento = document.getElementById('nascimentoPaciente').value;
    const telefone = document.getElementById('telefonePaciente').value.trim();
    const email = document.getElementById('emailPaciente').value.trim();
    const obs = document.getElementById('obsPaciente').value.trim();
    if (!nome || !nascimento) return alert("Preencha os campos obrigatórios.");

    const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
    pacientes.push({ nome, nascimento, telefone, email, obs });
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    alert("Paciente cadastrado.");
    document.querySelector('#pacientes form').reset();
    carregarPacientes();
}

function carregarPacientes() {
    const lista = document.getElementById('listaPacientes');
    lista.innerHTML = '';
    const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
    pacientes.forEach((p, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${p.nome}</strong> - ${p.nascimento}<br>${p.telefone} | ${p.email}<br><em>${p.obs}</em>`;
        lista.appendChild(li);
    });
}

function carregarPacientesSelect(selectId) {
    const select = document.getElementById(selectId);
    const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
    select.innerHTML = '';
    pacientes.forEach((p, i) => {
        const opt = document.createElement('option');
        opt.value = p.nome;
        opt.textContent = p.nome;
        select.appendChild(opt);
    });
}

function salvarProntuario() {
    const nome = document.getElementById('pacienteSelecionado').value;
    const texto = document.getElementById('textoProntuario').value.trim();
    if (!nome || !texto) return alert("Preencha todos os campos.");
    const prontuarios = JSON.parse(localStorage.getItem('prontuarios') || '[]');
    prontuarios.push({ nome, texto, data: new Date().toLocaleString() });
    localStorage.setItem('prontuarios', JSON.stringify(prontuarios));
    alert("Prontuário salvo.");
    document.getElementById('textoProntuario').value = '';
    carregarProntuarios();
}

function carregarProntuarios() {
    const lista = document.getElementById('listaProntuarios');
    lista.innerHTML = '';
    const prontuarios = JSON.parse(localStorage.getItem('prontuarios') || '[]');
    prontuarios.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${p.nome}</strong> - ${p.data}<br><pre>${p.texto}</pre>`;
        lista.appendChild(li);
    });
}

function salvarConsulta() {
    const nome = document.getElementById('pacienteConsulta').value;
    const data = document.getElementById('dataConsulta').value;
    if (!nome || !data) return alert("Preencha todos os campos.");
    const agenda = JSON.parse(localStorage.getItem('agenda') || '[]');
    agenda.push({ nome, data });
    localStorage.setItem('agenda', JSON.stringify(agenda));
    alert("Consulta agendada.");
    document.getElementById('dataConsulta').value = '';
    carregarAgenda();
}

function carregarAgenda() {
    const lista = document.getElementById('listaAgenda');
    lista.innerHTML = '';
    const agenda = JSON.parse(localStorage.getItem('agenda') || '[]');
    agenda.sort((a, b) => new Date(a.data) - new Date(b.data));
    agenda.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${new Date(item.data).toLocaleString()} - ${item.nome}`;
        lista.appendChild(li);
    });
}

function gerarRelatorio() {
    const prontuarios = JSON.parse(localStorage.getItem('prontuarios') || '[]');
    const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
    const agenda = JSON.parse(localStorage.getItem('agenda') || '[]');
    const totalConsultas = agenda.length;
    const totalPacientes = pacientes.length;
    const totalProntuarios = prontuarios.length;
    const porPaciente = {};
    prontuarios.forEach(p => {
        porPaciente[p.nome] = (porPaciente[p.nome] || 0) + 1;
    });
    let texto = `Total de Pacientes: ${totalPacientes}\nTotal de Prontuários: ${totalProntuarios}\nTotal de Consultas: ${totalConsultas}\n\nSessões por Paciente:\n`;
    for (const nome in porPaciente) {
        texto += `- ${nome}: ${porPaciente[nome]} sessões\n`;
    }
    document.getElementById('saidaRelatorio').textContent = texto;
}
