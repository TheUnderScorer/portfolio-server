import AppConfig from '../types/AppConfig';
import getContext from '../graphql/getContext';

const appConfig: AppConfig = {
    contextProvider: getContext(),
};

export default appConfig;
