class String
    def clear_ip
        s = self
        s = s.gsub('.', '')
        s = s.gsub(':', '')
        s
    end
end