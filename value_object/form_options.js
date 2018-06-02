var Options = function(options) {
    this.options = options || {};
};

Options.prototype.getType = function() {
    return this.options.type;
}