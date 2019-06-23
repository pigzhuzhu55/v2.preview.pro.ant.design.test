export function getAuthority(str) {
  const authorityString =localStorage.getItem('antd-pro-authority') ;
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = {
      proPermission:[],
      proUserType:'guest'
    };
  }
  return authority;
}
export function setAuthority(data) {
  
  const proPermission = typeof data.permissions === 'string' ? [data.permissions] : data.permissions;
  const proUserType = typeof data.userType === 'string' ? [data.userType] : data.userType;

  const proAuthority = {
    proPermission,
    proUserType
  }
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}
