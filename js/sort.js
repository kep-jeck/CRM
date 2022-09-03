export default async function sortUsers(users, sortType = 5, direction = 1) {
  const SORT_TYPE = {
    id: 'id',
    fullname: 'fullname',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  };

  const sortting = (a, b, flag) => {
    if (a > b) { return flag; }
    if (a < b) { return -flag; }
    return 0;
  };

  switch (sortType) {
    case SORT_TYPE.id:
      return users.sort((a, b) => sortting(a.id, b.id, direction));
    case SORT_TYPE.fullname:
      return users.sort((a, b) => {
        const fullname1 = `${a.surname} ${a.name} ${a.lastName}`;
        const fullname2 = `${b.surname} ${b.name} ${b.lastName}`;
        return sortting(fullname1, fullname2, direction);
      });

    case SORT_TYPE.createdAt:
      return users.sort((a, b) => sortting(a.createdAt, b.createdAt, direction));

    case SORT_TYPE.updatedAt:
      return users.sort((a, b) => sortting(a.updatedAt, b.updatedAt, direction));

    default:
      break;
  }
}
