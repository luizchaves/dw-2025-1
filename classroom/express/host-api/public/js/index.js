import HostForm from './components/HostForm.js';
import Modal from './components/Modal.js';
import * as LineChart from './components/LineChart.js';
import Hosts from './lib/hosts.js';

Hosts.load();

HostForm.create();

Modal.create();

LineChart.create('chart-line');
