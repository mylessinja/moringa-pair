import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/pairings';

const pairingHistory = [
  {
    id: 'pair-2026-08-17',
    week: '2026-08-17',
    partner: 'Sarah Kim',
    partnerEmail: 'sarah.kim@moringa.school',
    cohort: 'SDF-FT-05',
    focus: 'React & UI',
    publishedAt: 'Aug 17, 2026',
  },
  {
    id: 'pair-2026-08-10',
    week: '2026-08-10',
    partner: 'David Turner',
    partnerEmail: 'david.turner@moringa.school',
    cohort: 'SDF-FT-05',
    focus: 'Data Structures',
    publishedAt: 'Aug 10, 2026',
  },
  {
    id: 'pair-2026-08-03',
    week: '2026-08-03',
    partner: 'Maya Okafor',
    partnerEmail: 'maya.okafor@moringa.school',
    cohort: 'SDF-FT-05',
    focus: 'Python Backend',
    publishedAt: 'Aug 3, 2026',
  },
];

const wait = (value) => new Promise((resolve) => {
  setTimeout(() => resolve(value), 350);
});

const getToken = () => localStorage.getItem('moringaPairToken');

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getCurrentPairing = async () => {
  try {
    const token = getToken();
    if (!token) {
      return wait(pairingHistory[0]);
    }

    // Get current pairing
    const pairingResponse = await axios.get(`${API_BASE_URL}/current`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const pairing = pairingResponse.data;

    return {
      id: pairing.id,
      week: pairing.week,
      partner: pairing.partner_name,
      partnerEmail: pairing.partner_email,
      cohort: pairing.cohort,
      focus: pairing.focus,
      status: pairing.status,
      publishedAt: formatDate(pairing.week),
    };
  } catch (error) {
    console.error('Error fetching current pairing:', error);
    // Fallback to mock data if API fails
    return wait(pairingHistory[0]);
  }
};

const getPairingHistory = async () => {
  try {
    const token = getToken();
    if (!token) {
      return wait(pairingHistory);
    }

    const response = await axios.get(`${API_BASE_URL}/history?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.map((pairing) => ({
      id: pairing.id,
      week: pairing.week,
      partner: pairing.partner_name,
      partnerEmail: pairing.partner_email,
      cohort: pairing.cohort,
      focus: pairing.focus,
      status: pairing.status,
      publishedAt: formatDate(pairing.week),
    }));
  } catch (error) {
    console.error('Error fetching pairing history:', error);
    // Fallback to mock data if API fails
    return wait(pairingHistory);
  }
};

const updatePairingStatus = async (pairingId, newStatus) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await axios.patch(
      `${API_BASE_URL}/${pairingId}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data.pairing;
  } catch (error) {
    console.error('Error updating pairing status:', error);
    throw error;
  }
};

const createPairing = async (studentId, partnerId, week, cohort = null, focus = null) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await axios.post(
      `${API_BASE_URL}/create`,
      {
        student_id: studentId,
        partner_id: partnerId,
        week,
        cohort,
        focus,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data.pairing;
  } catch (error) {
    console.error('Error creating pairing:', error);
    throw error;
  }
};

const autoPairStudents = async (week, cohort = null, focus = null) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await axios.post(
      `${API_BASE_URL}/auto-pair`,
      { week, cohort, focus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error('Error auto-pairing students:', error);
    throw error;
  }
};

const getAllPairings = async (week = null, cohort = null) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token');
    }

    let url = API_BASE_URL;
    const params = [];
    if (week) params.push(`week=${week}`);
    if (cohort) params.push(`cohort=${cohort}`);
    if (params.length > 0) url += '?' + params.join('&');

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching pairings:', error);
    throw error;
  }
};

export {
  getCurrentPairing,
  getPairingHistory,
  updatePairingStatus,
  createPairing,
  autoPairStudents,
  getAllPairings,
};
