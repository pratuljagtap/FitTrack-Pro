// Entity exports for the fitness tracker app
// In a real app, these would connect to a backend API or database

export const Exercise = window.Exercise || {
  async list(orderBy = '', limit = null) {
    return [];
  },
  async create(data) {
    return { id: Date.now().toString(), ...data };
  },
  async findById(id) {
    return null;
  },
  async update(id, data) {
    return null;
  }
};

export const Workout = window.Workout || {
  async list(orderBy = '', limit = null) {
    return [];
  },
  async create(data) {
    return { id: Date.now().toString(), ...data };
  },
  async findById(id) {
    return null;
  },
  async update(id, data) {
    return null;
  }
};

export const Goal = window.Goal || {
  async list(orderBy = '', limit = null) {
    return [];
  },
  async create(data) {
    return { id: Date.now().toString(), ...data };
  },
  async findById(id) {
    return null;
  },
  async update(id, data) {
    return null;
  }
};

export const WorkoutSet = window.WorkoutSet || {
  async list(orderBy = '', limit = null) {
    return [];
  },
  async create(data) {
    return { id: Date.now().toString(), ...data };
  },
  async findById(id) {
    return null;
  },
  async update(id, data) {
    return null;
  }
};