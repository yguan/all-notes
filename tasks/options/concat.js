module.exports = {
    cssdev: {
        src: [
            '<%= folder.src %>/less/css/bootstrap-min.css',
            '<%= folder.src %>/less/css/font-awesome-min.css',
            '<%= folder.src %>/less/css/throbber.css',
            '<%= folder.src %>/css/app.css'
        ],
        dest: '<%= folder.src %>/css/app-min.css'
    },
    cssdist: {
        src: [
            '<%= folder.src %>/less/css/bootstrap-min.css',
            '<%= folder.src %>/less/css/font-awesome-min.css',
            '<%= folder.src %>/less/css/throbber.css',
            '<%= folder.buildTemp %>/app.css'
        ],
        dest: '<%= folder.distTemp %>/css/app-min.css'
    }
};
