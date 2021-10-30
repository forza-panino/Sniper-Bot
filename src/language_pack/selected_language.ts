import it from './italian';
import en from "./english";

const lang = (process.env.npm_package_config_language as string).toLowerCase() == 'it' ? it.lang : en.lang;
export default {lang}