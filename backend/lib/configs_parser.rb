require 'yaml'

def configs
    file_content = File.open(Dir.getwd + '/configs/configs.yml', 'r').read
    return YAML.load(file_content)
end