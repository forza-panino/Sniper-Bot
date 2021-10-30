if (process.argv[2].toLowerCase() == "-it") {
    process.env.npm_package_config_language = 'it';
    console.log("È stata impostata la lingua italiana.");
}
else if (process.argv[2].toLowerCase() == "-en") {
    process.env.npm_package_config_language = 'en';
    console.log("The language is now English.");
}
else {
    process.env.npm_package_config_language = 'en';
    console.log("Language is not correct. English has been set as default.");
}