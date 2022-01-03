class Array
    def without_nil
       self.select { |value| 
        value != nil && value.class == NilClass
       }
    end
end

def validate_params(names, values)
    raise "names length isn't equals with values length" if names.length != values.length
    @errors = []
    names.each_with_index do |item, index|
        if values[index].class == NilClass || values[index] == nil || values[index].empty? || values[index].length == 0
            @errors << {
                input_name: item,
                message: "#{item} can't be empty"
            }
        end
        if index == names.length - 1
            if @errors.length == 0
                return nil
            else
                return @errors
            end
        end
    end
end

def min_length(name, value, length)
    state = value.length <= length
    if state == true
        return {
            input_name: name, 
            message: "#{name} must be at least #{length} characters long"
        }
    else
        return nil
    end
end

def max_length(name, value, length)
    state = value.length > length
    if state == true
        return {
            input_name: name, 
            message: "#{name} can be up to #{length} characters"
        }
    else
        return nil
    end
end