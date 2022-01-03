require 'yaml'

def configs
    file_content = File.open(Dir.getwd + '/config/configs.yml', 'r').read
    return YAML.load(file_content)
end