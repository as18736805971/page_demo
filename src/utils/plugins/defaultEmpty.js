export default (key, name, namespace) => {
    if (!namespace) namespace = 'http://flowable.org/bpmn'
    const TYPE_TARGET = {
        activiti: "http://activiti.org/bpmn",
        camunda: "http://bpmn.io/schema/bpmn",
        flowable: "http://flowable.org/bpmn"
    };
    return `
    <?xml version="1.0" encoding="UTF-8"?>
    <bpmn2:definitions
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
      xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
      xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
      xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
      xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
      id="diagram_${key}"
      targetNamespace="${namespace}">
      <bpmn2:process id="${key}" name="${name}" isExecutable="true">
      </bpmn2:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}">
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </bpmn2:definitions>
  `;
};
