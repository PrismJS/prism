prismEvalTest.codeExecuted("will throw an error (external code)");
this.isNotJs();
prismEvalTest.codeShouldNotBeExecuted("will not be reached (external code)");
