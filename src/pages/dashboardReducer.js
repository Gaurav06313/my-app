export default function dashboardReducer (state = {}, action) {
    const { type = '' } = action;
    switch(type) {
        case 'ADD_NEW_USER':
            return {
                ...state,
                allUsers: action.payload
            }
        default:
            return state;
    }
}