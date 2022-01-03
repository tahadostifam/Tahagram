def validate_params(names, values)
    raise "names length is'nt equals with values length" if names.length != values.length
    @errors = []
    values.each_with_index do |item, index|
        if item == nil || item.empty? || item.length == 0
            @errors << "#{names[index]} cant be empty"
        end
        if index == values.length - 1
            if @errors.length == 0
                return true
            else
                return @errors.to_a
            end
        end
    end
end