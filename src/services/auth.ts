function getToken() {
  let token = localStorage.getItem("authToken");

  if (token !== null) return JSON.parse(token);

  return null;
}
function setToken(credential: {
  token: string;
  currentUserId: string;
  profilePhoto: {
    createdAt?: Date;
    path?: string;
    mimetype?: string;
    size?: number;
  };
}) {
  localStorage.setItem("authToken", JSON.stringify(credential));
}

function removeAuth() {
  localStorage.removeItem("authToken");
}

export { getToken, setToken, removeAuth };
