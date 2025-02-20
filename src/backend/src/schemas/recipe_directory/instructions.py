
class Instructions:
    def __init__(self, list_of_instructions=[]):
        self.__list_of_instructions = list_of_instructions
    
    def __str__(self):
        instruction_representation = [f"{step + 1}. {self.__list_of_instructions[step]}\n" for step in range(len(self.__list_of_instructions) - 1)]
        return instruction_representation[0:len(instruction_representation) - 1] # To remove the last \n
    
    def add_step(self, new_step):
        self.__list_of_instructions.append(new_step)
    
    def remove_step(self, step_number):
        try:
            self.__list_of_instructions.remove(step_number - 1)
        except:
            raise Exception("Step does not exist!")
        
    def change_step(self, step_number, new_step):
        if isinstance(new_step, str):
            self.__list_of_instructions[step_number - 1] = new_step
        else:
            raise Exception("New step must be a string!")