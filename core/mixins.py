class SoftDeleteMixin:
    def mark_as_deleted(self):
        self.is_active = False
        self.save(update_fields = ['is_active'])
        
    def restore(self):
        self.is_active = True
        self.save(update_fields = ['is_active'])    
        
        
class StatusMixin:
    def set_status(self, new_status):
        self.status = new_status
        self.save(update_fileds = ['status']) 
        
    def is_pending(self):
        return self.status == "PENDING" 
    
    def is_completed(self):
        return self.status == "COMPLETED"          