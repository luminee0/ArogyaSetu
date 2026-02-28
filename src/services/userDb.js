// Minimal localStorage-backed user database.
// Stores registered users as an array under 'pokedoc_users'.

const STORAGE_KEY = 'pokedoc_users';

function getAll() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function save(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

/** Register a new user. Returns the created user object or null if email already exists. */
export function registerUser({ name, email, phone, dob, gender, height, weight, bloodType, allergies, conditions }) {
    const users = getAll();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return null; // already registered
    }
    const user = {
        name,
        email: email.toLowerCase(),
        phone,
        dob: dob || '',
        gender: gender || '',
        height: height || '',
        weight: weight || '',
        bloodType: bloodType || '',
        allergies: allergies || '',
        conditions: conditions || '',
        createdAt: new Date().toISOString(),
    };
    users.push(user);
    save(users);
    return user;
}

/** Look up a registered user by email. Returns the user object or null. */
export function findUserByEmail(email) {
    return getAll().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/** Update an existing user record by email. Merges provided fields. Returns updated user or null. */
export function updateUser(email, fields) {
    const users = getAll();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...fields };
    save(users);
    return users[idx];
}
