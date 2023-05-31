type Task = () => (void | Promise<void>);

function wrapTask(name: string, task: Task): Task {
	return async function $() {
		console.log(`[Starting: ${name}]`);
		const start = Date.now();
		await task();
		const duration = (Date.now() - start) / 1000;
		console.log(`[Done: ${name} (${duration.toFixed(2)}s)]`);
	};
}
function wrapUnnamedTask(task: Task): Task {
	const name = task.name;
	if (!name.startsWith('$')) {
		task = wrapTask(name, task);
	}
	return task;
}

export function series(...tasks: Task[]): Task {
	return async function $() {
		for (const task of tasks.map(wrapUnnamedTask)) {
			await task();
		}
	};
}
export function parallel(...tasks: Task[]): Task {
	return async function $() {
		await Promise.all(tasks.map(async (task) => {
			await wrapUnnamedTask(task)();
		}));
	};
}

/**
 * Given a record of tasks, it will run the task as dictated by the CLI arguments.
 *
 * To run a specific task, run `node path/to/script.js taskName`.
 */
export function run(tasks: Partial<Record<string, Task>>) {
	const selected = String(process.argv[2]);
	const task = tasks[selected];
	if (!task) {
		console.error(`No such task ${selected}. Available tasks: ${Object.keys(tasks).join(', ')}`);
	} else {
		runTask(task);
	}
}

/**
 * Runs the given task.
 */
export function runTask(tasks: Task) {
	Promise.resolve().then(() => tasks()).catch(
		(reason) => {
			console.error('Error:');
			console.error(reason);
		}
	);
}
